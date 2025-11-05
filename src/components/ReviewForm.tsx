"use client";

import React, { useState } from 'react';
import StarRating from './StarRating';
import { useReviews } from '@/context/ReviewsContext';
import styles from '@/styles/ReviewForm.module.css';

interface ReviewFormProps {
  productId: number;
  productName: string;
  onReviewSubmitted?: () => void;
}

export default function ReviewForm({ productId, productName, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const { addReview } = useReviews();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Por favor selecciona una calificación');
      return;
    }
    
    if (comment.trim().length < 10) {
      alert('Por favor escribe un comentario más detallado (mínimo 10 caracteres)');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simular delay de envío
      await new Promise(resolve => setTimeout(resolve, 500));
      
      addReview(productId, rating, comment, userName);
      
      // Limpiar formulario
      setRating(0);
      setComment('');
      setUserName('');
      setShowForm(false);
      
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      alert('Error al enviar la reseña. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setRating(0);
    setComment('');
    setUserName('');
    setShowForm(false);
  };

  if (!showForm) {
    return (
      <div className={styles.reviewFormContainer}>
        <button 
          className={styles.openFormButton}
          onClick={() => setShowForm(true)}
        >
          ✍️ Escribir una reseña
        </button>
      </div>
    );
  }

  return (
    <div className={styles.reviewFormContainer}>
      <div className={styles.reviewForm}>
        <h3 className={styles.formTitle}>
          Escribe tu reseña para "{productName}"
        </h3>
        
        <form onSubmit={handleSubmit}>
          {/* Calificación con estrellas */}
          <div className={styles.ratingSection}>
            <label className={styles.fieldLabel}>
              Calificación *
            </label>
            <StarRating
              rating={rating}
              size="large"
              interactive={true}
              onRatingChange={setRating}
            />
            {rating > 0 && (
              <span className={styles.ratingText}>
                {rating === 1 && "Muy malo"}
                {rating === 2 && "Malo"}
                {rating === 3 && "Regular"}
                {rating === 4 && "Bueno"}
                {rating === 5 && "Excelente"}
              </span>
            )}
          </div>

          {/* Nombre del usuario */}
          <div className={styles.fieldGroup}>
            <label htmlFor="userName" className={styles.fieldLabel}>
              Tu nombre (opcional)
            </label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Nombre o apodo"
              maxLength={50}
              className={styles.nameInput}
            />
          </div>

          {/* Comentario */}
          <div className={styles.fieldGroup}>
            <label htmlFor="comment" className={styles.fieldLabel}>
              Tu reseña *
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Comparte tu experiencia con este producto... ¿Qué te gustó? ¿Qué mejorarías? ¿Lo recomendarías?"
              minLength={10}
              maxLength={500}
              rows={4}
              className={styles.commentInput}
              required
            />
            <div className={styles.charCount}>
              {comment.length}/500 caracteres
            </div>
          </div>

          {/* Botones */}
          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={handleCancel}
              className={styles.cancelButton}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
            >
              {isSubmitting ? (
                <>
                  <span className={styles.spinner}></span>
                  Enviando...
                </>
              ) : (
                'Publicar reseña'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}