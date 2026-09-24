import { useEffect, useMemo, useRef, useState } from "react";
import { createProduct, updateProduct } from "../../services/productService";
import { uploadProductImage } from "../../services/uploadService";
import { getApiErrorMessage } from "../../utils/errors";
import Button from "../ui/Button";
import ProductImage from "../product/ProductImage";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
};

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE_MB = 5;

function toFormState(product) {
  if (!product) return EMPTY_FORM;
  return {
    name: product.name ?? "",
    description: product.description ?? "",
    price: product.price ?? "",
    category: product.category ?? "",
    stock: product.stock ?? "",
  };
}

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Name is required.";
  if (!form.description.trim()) errors.description = "Description is required.";

  if (form.price === "" || form.price === null) {
    errors.price = "Price is required.";
  } else if (Number.isNaN(Number(form.price)) || Number(form.price) < 0) {
    errors.price = "Enter a valid price.";
  }

  if (!form.category.trim()) errors.category = "Category is required.";

  if (form.stock === "" || form.stock === null) {
    errors.stock = "Stock is required.";
  } else if (!Number.isInteger(Number(form.stock)) || Number(form.stock) < 0) {
    errors.stock = "Enter a valid whole number.";
  }

  return errors;
}

function validateImageFile(file) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Only JPG, PNG or WEBP images are allowed.";
  }
  if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
    return `Image must be smaller than ${MAX_IMAGE_SIZE_MB}MB.`;
  }
  return "";
}

function Field({ id, label, error, multiline = false, ...props }) {
  const Control = multiline ? "textarea" : "input";
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <Control
        id={id}
        className="input"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <p className="field__error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Add/Edit product dialog. Reuses the site's existing .card/.field/.input/.btn
 * primitives so it matches the rest of the admin UI without new design work.
 *
 * Image handling: the admin picks a file from their computer instead of
 * pasting a URL. On submit, a newly picked file is uploaded to Cloudinary
 * first (via the backend's admin-only upload endpoint) and the returned
 * secure URL is what gets saved on the product's existing `image` field —
 * the binary itself never touches MongoDB. If editing and no new file is
 * picked, the product's existing image URL is kept as-is.
 */
export default function ProductFormModal({ product, onClose, onSaved }) {
  const isEditing = Boolean(product);
  const [form, setForm] = useState(() => toFormState(product));
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState("");
  const fileInputRef = useRef(null);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const submitting = uploadingImage || savingProduct;

  // Live preview of the newly picked file, derived (not stored) so there is
  // a single object URL per file selection. A cleanup-only effect revokes
  // it — either when a different file is picked or the dialog unmounts.
  const previewObjectUrl = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : null),
    [imageFile],
  );
  useEffect(() => {
    return () => {
      if (previewObjectUrl) URL.revokeObjectURL(previewObjectUrl);
    };
  }, [previewObjectUrl]);
  const previewUrl = previewObjectUrl ?? product?.image ?? "";

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape" && !submitting) onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, submitting]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const error = validateImageFile(file);
    if (error) {
      setImageError(error);
      setImageFile(null);
      event.target.value = "";
      return;
    }

    setImageError("");
    setImageFile(file);
  }

  function handleRemoveSelectedImage() {
    setImageFile(null);
    setImageError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;

    const errors = validate(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitError("");

    // A new file was picked -> upload it first and use the Cloudinary URL.
    // Otherwise, keep whatever image the product already had (or "" for a
    // brand-new product with no image selected).
    let imageUrl = product?.image ?? "";
    if (imageFile) {
      setUploadingImage(true);
      try {
        imageUrl = await uploadProductImage(imageFile);
      } catch (error) {
        setSubmitError(
          getApiErrorMessage(error, "Couldn't upload the image. Please try again."),
        );
        setUploadingImage(false);
        return;
      }
      setUploadingImage(false);
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      category: form.category.trim(),
      stock: Number(form.stock),
      image: imageUrl,
    };

    setSavingProduct(true);
    try {
      const saved = isEditing
        ? await updateProduct(product._id, payload)
        : await createProduct(payload);
      onSaved(saved);
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(error, "Couldn't save this product. Please try again."),
      );
      setSavingProduct(false);
    }
  }

  let submitLabel = isEditing ? "Save changes" : "Add product";
  if (uploadingImage) submitLabel = "Uploading image…";
  else if (savingProduct) submitLabel = "Saving…";

  return (
    <div className="modal-overlay" role="presentation" onClick={() => !submitting && onClose()}>
      <div
        className="modal card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-form-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="modal__title" id="product-form-title">
          {isEditing ? "Edit product" : "Add product"}
        </h2>

        {submitError && (
          <p className="feedback feedback--error" role="alert">
            {submitError}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <fieldset className="modal__fieldset" disabled={submitting}>
            <legend className="sr-only">Product details</legend>

            <Field
              id="product-name"
              name="name"
              label="Name"
              maxLength={120}
              value={form.name}
              onChange={handleChange}
              error={fieldErrors.name}
            />
            <Field
              id="product-description"
              name="description"
              label="Description"
              multiline
              rows={3}
              maxLength={2000}
              value={form.description}
              onChange={handleChange}
              error={fieldErrors.description}
            />
            <div className="modal__row">
              <Field
                id="product-price"
                name="price"
                label="Price"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={form.price}
                onChange={handleChange}
                error={fieldErrors.price}
              />
              <Field
                id="product-stock"
                name="stock"
                label="Stock"
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                value={form.stock}
                onChange={handleChange}
                error={fieldErrors.stock}
              />
            </div>
            <Field
              id="product-category"
              name="category"
              label="Category"
              maxLength={60}
              value={form.category}
              onChange={handleChange}
              error={fieldErrors.category}
            />

            <div className="field">
              <span className="field__label" id="product-image-label">
                Product image (optional)
              </span>
              <div className="admin-image-field">
                <div className="admin-image-field__preview">
                  <ProductImage src={previewUrl} alt={form.name || "Product image"} />
                </div>
                <div className="admin-image-field__controls">
                  <input
                    ref={fileInputRef}
                    id="product-image"
                    name="imageFile"
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    className="sr-only"
                    aria-labelledby="product-image-label"
                    aria-describedby={imageError ? "product-image-error" : undefined}
                    onChange={handleFileChange}
                  />
                  <div className="admin-image-field__buttons">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {previewUrl ? "Change image" : "Choose image"}
                    </Button>
                    {imageFile && (
                      <Button type="button" variant="ghost" size="sm" onClick={handleRemoveSelectedImage}>
                        Undo selection
                      </Button>
                    )}
                  </div>
                  {imageFile && <p className="admin-image-field__filename">{imageFile.name}</p>}
                  <p className="admin-image-field__hint">JPG, PNG or WEBP — up to {MAX_IMAGE_SIZE_MB}MB.</p>
                  {imageError && (
                    <p className="field__error" id="product-image-error">
                      {imageError}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </fieldset>

          <div className="modal__actions">
            <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} aria-busy={submitting}>
              {submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
