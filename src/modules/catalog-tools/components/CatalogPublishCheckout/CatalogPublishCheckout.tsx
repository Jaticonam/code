import type {
  CatalogComposition,
} from "@/modules/catalog/domain/CatalogComposition";

import {
  resolveCatalogPublicationEligibility,
} from "@/modules/catalog/domain/CatalogPublicationEligibility";

import {
  resolveCatalogPublicationCover,
  type CatalogPublicationIdentity,
} from "@/modules/catalog/domain/CatalogPublicationIdentity";

import "./CatalogPublishCheckout.css";

type PublicationEligibilityInput =
  Parameters<
    typeof resolveCatalogPublicationEligibility
  >[0];

interface CatalogPublishCheckoutProps {
  composition:
    CatalogComposition;

  resolution:
    PublicationEligibilityInput["resolution"];

  publicationIdentity:
    CatalogPublicationIdentity;

  onPublicationIdentityChange:
    (
      value:
        CatalogPublicationIdentity |
        ((
          current:
            CatalogPublicationIdentity,
        ) => CatalogPublicationIdentity),
    ) => void;

  modeLabel:
    string;

  categorySummary:
    string;

  campaignSummary:
    string;
}

export default function CatalogPublishCheckout({
  composition,
  resolution,
  publicationIdentity,
  onPublicationIdentityChange:
    setPublicationIdentity,
  modeLabel,
  categorySummary,
  campaignSummary,
}: CatalogPublishCheckoutProps) {
  const resolvedCover =
    resolveCatalogPublicationCover(
      publicationIdentity,
      composition,
    );

  const eligibility =
    resolveCatalogPublicationEligibility({
      composition,
      resolution,
      publicationIdentity,
    });

  const automaticIds =
    new Set(
      resolution
        .automaticProductIds,
    );

  const resolvedIds =
    new Set(
      resolution.productIds,
    );

  const effectiveAddedCount =
    resolution
      .productIds
      .filter(
        (productId) =>
          !automaticIds.has(
            productId,
          ),
      )
      .length;

  const effectiveRemovedCount =
    resolution
      .automaticProductIds
      .filter(
        (productId) =>
          !resolvedIds.has(
            productId,
          ),
      )
      .length;

  const hasProducts =
    resolution.productIds.length >
    0;

  const isV2Publicable =
    hasProducts &&
    eligibility.status ===
      "v2-publicable";

  return (
    <section className="catalog-publish-checkout">
      <div className="catalog-publish-checkout__main">
        <header className="catalog-publish-checkout__intro">
          <span>
            Presentación
          </span>

          <h3>
            Últimos detalles
          </h3>

          <p>
            Define cómo verá el cliente este catálogo.
            El nombre interno del borrador permanece
            separado de su presentación pública.
          </p>
        </header>

        <div className="catalog-publish-checkout__fields">
          <label>
            <span>
              Título público
            </span>

            <input
              type="text"
              value={
                publicationIdentity.title
              }
              maxLength={
                90
              }
              placeholder="Opcional · Ej. Selección mayorista de flores"
              onChange={(event) =>
                setPublicationIdentity(
                  (current) => ({
                    ...current,

                    title:
                      event.target.value,
                  }),
                )
              }
            />
          </label>

          <label>
            <span>
              Descripción
            </span>

            <textarea
              value={
                publicationIdentity.description
              }
              maxLength={
                180
              }
              rows={
                3
              }
              placeholder="Opcional · Describe brevemente esta selección."
              onChange={(event) =>
                setPublicationIdentity(
                  (current) => ({
                    ...current,

                    description:
                      event.target.value,
                  }),
                )
              }
            />
          </label>
        </div>

        <section className="catalog-publish-checkout__cover">
          <div className="catalog-publish-checkout__coverControls">
            <span className="catalog-publish-checkout__eyebrow">
              Portada
            </span>

            <div className="catalog-publish-checkout__coverOptions">
              <label>
                <input
                  type="radio"
                  name="catalog-publish-cover"
                  value="auto"
                  checked={
                    publicationIdentity
                      .cover
                      .strategy ===
                    "auto"
                  }
                  onChange={() =>
                    setPublicationIdentity(
                      (current) => ({
                        ...current,

                        cover: {
                          ...current.cover,

                          strategy:
                            "auto",
                        },
                      }),
                    )
                  }
                />

                Automática
              </label>

              <label>
                <input
                  type="radio"
                  name="catalog-publish-cover"
                  value="custom"
                  checked={
                    publicationIdentity
                      .cover
                      .strategy ===
                    "custom"
                  }
                  onChange={() =>
                    setPublicationIdentity(
                      (current) => ({
                        ...current,

                        cover: {
                          ...current.cover,

                          strategy:
                            "custom",
                        },
                      }),
                    )
                  }
                />

                Personalizada
              </label>
            </div>

            {publicationIdentity
              .cover
              .strategy ===
            "custom" ? (
              <label className="catalog-publish-checkout__customUrl">
                <span>
                  URL de imagen
                </span>

                <input
                  type="url"
                  value={
                    publicationIdentity
                      .cover
                      .customImageUrl
                  }
                  placeholder="https://..."
                  onChange={(event) =>
                    setPublicationIdentity(
                      (current) => ({
                        ...current,

                        cover: {
                          ...current.cover,

                          customImageUrl:
                            event.target.value,
                        },
                      }),
                    )
                  }
                />
              </label>
            ) : null}
          </div>

          <aside className="catalog-publish-checkout__coverPreview">
            <span>
              Vista de portada
            </span>

            <div className="catalog-publish-checkout__coverImage">
              <img
                src={
                  resolvedCover.imagePath
                }
                alt="Portada del catálogo"
              />
            </div>

            <strong>
              {publicationIdentity
                .title
                .trim() ||
                "Catálogo Wooly"}
            </strong>

            {publicationIdentity
              .description
              .trim() ? (
              <p>
                {
                  publicationIdentity
                    .description
                }
              </p>
            ) : null}

            <small>
              Fuente:
              {" "}
              {resolvedCover.source ===
              "custom"
                ? "Personalizada"
                : resolvedCover.source ===
                    "campaign"
                  ? "Campaña"
                  : "Wooly"}
            </small>
          </aside>
        </section>
      </div>

      <aside
        className="catalog-publish-checkout__summary"
        aria-label="Resumen de publicación"
      >
        <div className="catalog-publish-checkout__summaryHead">
          <div>
            <span>
              Tu catálogo
            </span>

            <h3>
              {modeLabel}
            </h3>
          </div>

          <strong>
            {
              resolution
                .productIds
                .length
            }
          </strong>
        </div>

        {composition.mode ===
        "hybrid" ? (
          <div className="catalog-publish-checkout__metrics">
            <div>
              <span>
                Base
              </span>

              <strong>
                {
                  resolution
                    .automaticProductIds
                    .length
                }
              </strong>
            </div>

            <div>
              <span>
                Agregados
              </span>

              <strong>
                +{effectiveAddedCount}
              </strong>
            </div>

            <div>
              <span>
                Retirados
              </span>

              <strong>
                −{effectiveRemovedCount}
              </strong>
            </div>

            <div>
              <span>
                Resultado
              </span>

              <strong>
                {
                  resolution
                    .productIds
                    .length
                }
              </strong>
            </div>
          </div>
        ) : null}

        <div className="catalog-publish-checkout__scope">
          <div>
            <span>
              Categorías
            </span>

            <strong>
              {categorySummary}
            </strong>
          </div>

          <div>
            <span>
              Campañas
            </span>

            <strong>
              {campaignSummary}
            </strong>
          </div>
        </div>

        {!hasProducts ? (
          <div className="catalog-publish-checkout__status is-blocked">
            <strong>
              No hay productos para publicar
            </strong>

            <p>
              Agrega al menos un producto antes de
              continuar.
            </p>
          </div>
        ) : isV2Publicable ? (
          <div className="catalog-publish-checkout__status is-ready">
            <strong>
              ✓ Enlace público disponible
            </strong>

            <p>
              Esta composición puede representarse con
              el contrato público actual.
            </p>
          </div>
        ) : (
          <div className="catalog-publish-checkout__status is-custom">
            <strong>
              Publicación individual necesaria
            </strong>

            <p>
              Esta composición necesita un enlace
              público propio para conservar exactamente
              su selección o presentación.
            </p>
          </div>
        )}

        <p className="catalog-publish-checkout__note">
          La generación del enlace y las acciones para
          compartir se incorporan en A6-C.
        </p>
      </aside>
    </section>
  );
}
