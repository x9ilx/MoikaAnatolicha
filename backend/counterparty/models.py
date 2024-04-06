from django.db import models


class LegalEntity(models.Model):
    """Model definition for LegalEntity."""

    # TODO: Define fields here

    class Meta:
        """Meta definition for LegalEntity."""

        verbose_name = 'Контрагент'
        verbose_name_plural = 'Контрагенты'

    def __str__(self):
        """Unicode representation of LegalEntity."""
        pass
