import { useRef, useState } from 'react';
import Icon from '../common/Icon';
import { useObjectUrl } from '../../hooks/useObjectUrl';
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE_MB } from '../../config';
import { formatBytes } from '../../utils/format';
import './ImageUpload.css';

// click-to-browse
// current image 
export default function ImageUpload({ id, file, existingUrl, onChange, error, previewAlt, describedBy }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const objectUrl = useObjectUrl(file?.type?.startsWith('image/') ? file : null);
  const previewUrl = objectUrl || (file ? null : existingUrl);

  const browse = () => inputRef.current?.click();

  const handleFiles = (files) => {
    const next = files?.[0];
    if (next) onChange(next);
  };

  const dragProps = {
    onDragOver: (event) => {
      event.preventDefault();
      setDragging(true);
    },
    onDragLeave: (event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setDragging(false);
    },
    onDrop: (event) => {
      event.preventDefault();
      setDragging(false);
      handleFiles(event.dataTransfer.files);
    },
  };

  return (
    <div className={`image-upload${dragging ? ' is-dragging' : ''}${error ? ' has-error' : ''}`} {...dragProps}>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(',')}
        className="visually-hidden"
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = '';
        }}
      />

      {previewUrl || file ? (
        <div className="image-upload__preview">
          {previewUrl ? (
            <img src={previewUrl} alt={previewAlt} />
          ) : (
            <div className="hotel-image-fallback" role="img" aria-label="Selected file cannot be previewed">
              <Icon name="image" size={32} />
            </div>
          )}
          <div className="image-upload__meta">
            <p className="image-upload__name">{file ? file.name : 'Current image'}</p>
            <p className="field__hint">
              {file ? formatBytes(file.size) : 'Upload a new image to replace it.'}
            </p>
            <div className="image-upload__buttons">
              <button type="button" className="btn btn--secondary btn--sm" onClick={browse}>
                <Icon name="upload" size={14} />
                {file || existingUrl ? 'Change image' : 'Choose image'}
              </button>
              {file && (
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => onChange(null)}>
                  {existingUrl ? 'Keep current image' : 'Remove'}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <label htmlFor={id} className="image-upload__dropzone">
          <span className="image-upload__icon">
            <Icon name="upload" size={26} />
          </span>
          <span>
            <strong>Click to upload</strong> or drag and drop
          </span>
          <span className="field__hint">JPEG, PNG, WEBP or GIF · up to {MAX_IMAGE_SIZE_MB} MB</span>
        </label>
      )}
    </div>
  );
}
