import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  CatalogComposition,
} from "@/modules/catalog/domain/CatalogComposition";

import type {
  CatalogCompositionDraft,
} from "@/modules/catalog/domain/CatalogCompositionDraft";

import {
  DEFAULT_CATALOG_VALIDITY_DAYS,
} from "@/modules/catalog/domain/CatalogPublication";

import {
  createDefaultCatalogPublicationIdentity,
  prepareCatalogPublicationIdentity,
  resolveCatalogPublicationCover,
  type CatalogPublicationIdentity,
} from "@/modules/catalog/domain/CatalogPublicationIdentity";

import {
  catalogCompositionProvider,
} from "@/modules/catalog/providers/DefaultCatalogCompositionProvider";

import "./CatalogDraftManager.css";

interface CatalogDraftManagerProps {
  composition:
    CatalogComposition;

  resolvedProductIds:
    readonly string[];

  onLoadComposition:
    (
      composition:
        CatalogComposition,
    ) => void;

  onNewComposition:
    () => void;
}

const compositionFingerprint = (
  composition:
    CatalogComposition,
) =>
  JSON.stringify(
    composition,
  );

const identityFingerprint = (
  identity:
    CatalogPublicationIdentity,
) =>
  JSON.stringify(
    identity,
  );

function hasMeaningfulComposition(
  composition:
    CatalogComposition,
): boolean {
  return (
    composition.mode !==
      "automatic" ||
    composition.filters
      .categoryIds.length >
      0 ||
    composition.filters
      .campaignIds.length >
      0 ||
    composition.overrides
      .includedProductIds.length >
      0 ||
    composition.overrides
      .excludedProductIds.length >
      0
  );
}

function formatDate(
  value:
    string,
) {
  const date =
    new Date(
      value,
    );

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "es-PE",
    {
      dateStyle:
        "short",

      timeStyle:
        "short",
    },
  ).format(
    date,
  );
}

export default function CatalogDraftManager({
  composition,
  resolvedProductIds,
  onLoadComposition,
  onNewComposition,
}: CatalogDraftManagerProps) {
  const [
    drafts,
    setDrafts,
  ] =
    useState<
      readonly CatalogCompositionDraft[]
    >(
      [],
    );

  const [
    currentDraftId,
    setCurrentDraftId,
  ] =
    useState("");

  const [
    name,
    setName,
  ] =
    useState("");

  const [
    publicationIdentity,
    setPublicationIdentity,
  ] =
    useState<CatalogPublicationIdentity>(
      () =>
        createDefaultCatalogPublicationIdentity(),
    );

  const [
    savedFingerprint,
    setSavedFingerprint,
  ] =
    useState("");

  const [
    savedIdentityFingerprint,
    setSavedIdentityFingerprint,
  ] =
    useState("");

  const [
    savedName,
    setSavedName,
  ] =
    useState("");

  const [
    lastPublished,
    setLastPublished,
  ] =
    useState<CatalogCompositionDraft | null>(
      null,
    );

  const [
    isBusy,
    setIsBusy,
  ] =
    useState(
      false,
    );

  const [
    message,
    setMessage,
  ] =
    useState("");

  const [
    error,
    setError,
  ] =
    useState("");

  const editableDrafts =
    useMemo(
      () =>
        drafts.filter(
          (draft) =>
            draft.status ===
            "draft",
        ),
      [drafts],
    );

  const publishedCount =
    useMemo(
      () =>
        drafts.filter(
          (draft) =>
            draft.status ===
            "published",
        ).length,
      [drafts],
    );

  const archivedDraftCount =
    useMemo(
      () =>
        drafts.filter(
          (draft) =>
            draft.status ===
            "archived",
        ).length,
      [drafts],
    );

  const currentDraft =
    useMemo(
      () =>
        editableDrafts.find(
          (draft) =>
            draft.id ===
            currentDraftId,
        ) ??
        null,
      [
        editableDrafts,
        currentDraftId,
      ],
    );

  const currentFingerprint =
    useMemo(
      () =>
        compositionFingerprint(
          composition,
        ),
      [composition],
    );

  const currentIdentityFingerprint =
    useMemo(
      () =>
        identityFingerprint(
          publicationIdentity,
        ),
      [publicationIdentity],
    );

  const resolvedCover =
    useMemo(
      () =>
        resolveCatalogPublicationCover(
          publicationIdentity,
          composition,
        ),
      [
        publicationIdentity,
        composition,
      ],
    );

  const isDirty =
    currentDraftId
      ? currentFingerprint !==
          savedFingerprint ||
        currentIdentityFingerprint !==
          savedIdentityFingerprint ||
        name.trim() !==
          savedName
      : (
          name.trim().length >
            0 ||
          publicationIdentity.title
            .trim().length >
            0 ||
          publicationIdentity.description
            .trim().length >
            0 ||
          hasMeaningfulComposition(
            composition,
          )
        );

  const refreshDrafts =
    useCallback(
      async () => {
        const nextDrafts =
          await catalogCompositionProvider
            .listDrafts();

        setDrafts(
          nextDrafts,
        );
      },
      [],
    );

  useEffect(
    () => {
      void refreshDrafts()
        .catch(
          (reason) => {
            setError(
              reason instanceof
              Error
                ? reason.message
                : "No se pudieron cargar los catálogos.",
            );
          },
        );
    },
    [refreshDrafts],
  );

  const clearWorkingDraft =
    (
      nextMessage:
        string,
    ) => {
      onNewComposition();

      setCurrentDraftId("");
      setName("");

      setPublicationIdentity(
        createDefaultCatalogPublicationIdentity(),
      );

      setSavedName("");
      setSavedFingerprint("");
      setSavedIdentityFingerprint("");

      setMessage(
        nextMessage,
      );

      setError("");
    };

  const applyLoadedDraft =
    (
      draft:
        CatalogCompositionDraft,
    ) => {
      onLoadComposition(
        draft.composition,
      );

      setCurrentDraftId(
        draft.id,
      );

      setName(
        draft.name,
      );

      setPublicationIdentity(
        draft.publicationIdentity,
      );

      setSavedName(
        draft.name,
      );

      setSavedFingerprint(
        compositionFingerprint(
          draft.composition,
        ),
      );

      setSavedIdentityFingerprint(
        identityFingerprint(
          draft.publicationIdentity,
        ),
      );

      setLastPublished(
        null,
      );
    };

  const saveDraft =
    async () => {
      const normalizedName =
        name.trim();

      setMessage("");
      setError("");

      if (!normalizedName) {
        setError(
          "Escribe un nombre para guardar el catálogo.",
        );

        return;
      }

      const preparedIdentity =
        prepareCatalogPublicationIdentity(
          publicationIdentity,
          normalizedName,
        );

      setIsBusy(
        true,
      );

      try {
        const isUpdate =
          currentDraftId !==
          "";

        const saved =
          isUpdate
            ? await catalogCompositionProvider
                .updateDraft(
                  currentDraftId,
                  {
                    name:
                      normalizedName,

                    composition,

                    publicationIdentity:
                      preparedIdentity,
                  },
                )
            : await catalogCompositionProvider
                .createDraft({
                  name:
                    normalizedName,

                  composition,

                  publicationIdentity:
                    preparedIdentity,
                });

        applyLoadedDraft(
          saved,
        );

        setMessage(
          isUpdate
            ? "Cambios guardados."
            : "Borrador guardado.",
        );

        await refreshDrafts();
      } catch (reason) {
        setError(
          reason instanceof
          Error
            ? reason.message
            : "No se pudo guardar el borrador.",
        );
      } finally {
        setIsBusy(
          false,
        );
      }
    };

  const loadDraft =
    async (
      draftId:
        string,
    ) => {
      if (
        draftId ===
        currentDraftId
      ) {
        return;
      }

      if (
        isDirty &&
        !window.confirm(
          "Hay cambios sin guardar. ¿Deseas abrir otro borrador y descartarlos?",
        )
      ) {
        return;
      }

      if (!draftId) {
        return;
      }

      setMessage("");
      setError("");
      setIsBusy(
        true,
      );

      try {
        const draft =
          await catalogCompositionProvider
            .getDraft(
              draftId,
            );

        if (
          !draft ||
          draft.status !==
            "draft"
        ) {
          throw new Error(
            "El borrador ya no está disponible.",
          );
        }

        applyLoadedDraft(
          draft,
        );

        setMessage(
          "Borrador cargado.",
        );
      } catch (reason) {
        setError(
          reason instanceof
          Error
            ? reason.message
            : "No se pudo abrir el borrador.",
        );
      } finally {
        setIsBusy(
          false,
        );
      }
    };

  const startNew =
    () => {
      if (
        isDirty &&
        !window.confirm(
          "Hay cambios sin guardar. ¿Deseas comenzar un catálogo nuevo y descartarlos?",
        )
      ) {
        return;
      }

      setLastPublished(
        null,
      );

      clearWorkingDraft(
        "Nuevo catálogo listo.",
      );
    };

  const duplicateDraft =
    async () => {
      if (
        !currentDraft ||
        isDirty
      ) {
        return;
      }

      setMessage("");
      setError("");
      setIsBusy(
        true,
      );

      try {
        const duplicated =
          await catalogCompositionProvider
            .createDraft({
              name:
                `${currentDraft.name} - copia`,

              composition:
                currentDraft.composition,

              publicationIdentity:
                currentDraft.publicationIdentity,
            });

        applyLoadedDraft(
          duplicated,
        );

        setMessage(
          "Borrador duplicado.",
        );

        await refreshDrafts();
      } catch (reason) {
        setError(
          reason instanceof
          Error
            ? reason.message
            : "No se pudo duplicar el borrador.",
        );
      } finally {
        setIsBusy(
          false,
        );
      }
    };

  const archiveDraft =
    async () => {
      if (
        !currentDraft ||
        isDirty
      ) {
        return;
      }

      if (
        !window.confirm(
          `¿Archivar "${currentDraft.name}"?`,
        )
      ) {
        return;
      }

      setMessage("");
      setError("");
      setIsBusy(
        true,
      );

      try {
        await catalogCompositionProvider
          .archiveDraft(
            currentDraft.id,
          );

        await refreshDrafts();

        setLastPublished(
          null,
        );

        clearWorkingDraft(
          "Borrador archivado. Nuevo catálogo listo.",
        );
      } catch (reason) {
        setError(
          reason instanceof
          Error
            ? reason.message
            : "No se pudo archivar el borrador.",
        );
      } finally {
        setIsBusy(
          false,
        );
      }
    };

  const publishDraft =
    async () => {
      if (
        !currentDraft ||
        isDirty ||
        resolvedProductIds.length ===
          0
      ) {
        return;
      }

      const strategyLabel =
        currentDraft
          .composition
          .mode ===
        "automatic"
          ? "dinámico"
          : "fijo";

      if (
        !window.confirm(
          `¿Publicar "${currentDraft.name}" por ${DEFAULT_CATALOG_VALIDITY_DAYS} días como catálogo ${strategyLabel}? Después de publicar ya no podrá editarse.`,
        )
      ) {
        return;
      }

      setMessage("");
      setError("");
      setIsBusy(
        true,
      );

      try {
        const published =
          await catalogCompositionProvider
            .publishDraft(
              currentDraft.id,
              {
                resolvedProductIds,

                validityDays:
                  DEFAULT_CATALOG_VALIDITY_DAYS,
              },
            );

        await refreshDrafts();

        clearWorkingDraft(
          `${published.id} publicado correctamente.`,
        );

        setLastPublished(
          published,
        );
      } catch (reason) {
        setError(
          reason instanceof
          Error
            ? reason.message
            : "No se pudo publicar el catálogo.",
        );
      } finally {
        setIsBusy(
          false,
        );
      }
    };

  return (
    <section className="catalog-draft-manager">
      <header className="catalog-draft-manager__header">
        <div>
          <span>
            Catálogos
          </span>

          <h3>
            Guarda, prepara y publica
          </h3>

          <p>
            Trabaja como borrador y publícalo cuando la
            composición comercial esté lista.
          </p>
        </div>

        <div className="catalog-draft-manager__status">
          {currentDraft ? (
            <>
              <strong>
                {currentDraft.id}
              </strong>

              <small>
                Actualizado
                {" "}
                {formatDate(
                  currentDraft.updatedAt,
                )}
              </small>
            </>
          ) : (
            <>
              <strong>
                Nuevo catálogo
              </strong>

              <small>
                Aún no guardado
              </small>
            </>
          )}

          {isDirty ? (
            <span>
              Cambios sin guardar
            </span>
          ) : currentDraftId ? (
            <span className="is-saved">
              Guardado
            </span>
          ) : null}
        </div>
      </header>

      <div className="catalog-draft-manager__inventory">
        <span>
          <strong>
            {editableDrafts.length}
          </strong>
          {" "}
          borradores
        </span>

        <span>
          <strong>
            {publishedCount}
          </strong>
          {" "}
          publicados
        </span>

        <span>
          <strong>
            {archivedDraftCount}
          </strong>
          {" "}
          archivados
        </span>
      </div>

      {lastPublished?.publication ? (
        <div className="catalog-draft-manager__published">
          <div>
            <span>
              Publicado
            </span>

            <strong>
              {lastPublished.id}
            </strong>
          </div>

          <div>
            <small>
              Tipo
            </small>

            <strong>
              {lastPublished
                .publication
                .strategy ===
              "dynamic"
                ? "Dinámico"
                : "Fijo"}
            </strong>
          </div>

          <div>
            <small>
              Vigente hasta
            </small>

            <strong>
              {formatDate(
                lastPublished
                  .publication
                  .validUntil,
              )}
            </strong>
          </div>
        </div>
      ) : null}

      <div className="catalog-draft-manager__controls">
        <label>
          <span>
            Nombre interno
          </span>

          <input
            type="text"
            value={
              name
            }
            maxLength={
              120
            }
            placeholder="Ej. Cliente María - Agosto"
            disabled={
              isBusy
            }
            onChange={(event) =>
              setName(
                event.target.value,
              )
            }
          />
        </label>

        <label>
          <span>
            Abrir borrador
          </span>

          <select
            value={
              currentDraftId
            }
            disabled={
              isBusy ||
              editableDrafts.length ===
                0
            }
            onChange={(event) =>
              void loadDraft(
                event.target.value,
              )
            }
          >
            <option value="">
              {editableDrafts.length ===
              0
                ? "No hay borradores guardados"
                : "Seleccionar borrador..."}
            </option>

            {editableDrafts.map(
              (draft) => (
                <option
                  key={
                    draft.id
                  }
                  value={
                    draft.id
                  }
                >
                  {draft.name}
                  {" · "}
                  {draft.id}
                </option>
              ),
            )}
          </select>
        </label>
      </div>

      <section className="catalog-draft-manager__identity">
        <div className="catalog-draft-manager__identityFields">
          <header>
            <span>
              Identidad comercial
            </span>

            <h4>
              Cómo se presentará el catálogo
            </h4>
          </header>

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
              placeholder="Ej. Selección mayorista de flores"
              disabled={
                isBusy
              }
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
              placeholder="Describe brevemente esta selección para el cliente."
              disabled={
                isBusy
              }
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

          <div className="catalog-draft-manager__coverOptions">
            <span>
              Portada
            </span>

            <label>
              <input
                type="radio"
                name="catalog-cover-strategy"
                value="auto"
                checked={
                  publicationIdentity
                    .cover
                    .strategy ===
                  "auto"
                }
                disabled={
                  isBusy
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
                name="catalog-cover-strategy"
                value="custom"
                checked={
                  publicationIdentity
                    .cover
                    .strategy ===
                  "custom"
                }
                disabled={
                  isBusy
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
            <label>
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
                disabled={
                  isBusy
                }
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

        <aside className="catalog-draft-manager__coverPreview">
          <span>
            Vista de portada
          </span>

          <div>
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
              name.trim() ||
              "Catálogo Wooly"}
          </strong>

          {publicationIdentity
            .description
            .trim() ? (
            <p>
              {publicationIdentity.description}
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

      <div className="catalog-draft-manager__publicationInfo">
        <div>
          <strong>
            Publicación
          </strong>

          <span>
            Vigencia estándar:
            {" "}
            {DEFAULT_CATALOG_VALIDITY_DAYS}
            {" "}
            días
          </span>
        </div>

        <div>
          <strong>
            {composition.mode ===
            "automatic"
              ? "Dinámico"
              : "Fijo"}
          </strong>

          <span>
            {composition.mode ===
            "automatic"
              ? "La selección se resolverá con sus reglas vigentes."
              : "Se congelarán los productos visibles al publicar."}
          </span>
        </div>
      </div>

      <div className="catalog-draft-manager__buttons">
        <button
          type="button"
          className="is-primary"
          disabled={
            isBusy ||
            !name.trim() ||
            (
              currentDraftId !==
                "" &&
              !isDirty
            )
          }
          onClick={() =>
            void saveDraft()
          }
        >
          {isBusy
            ? "Procesando..."
            : currentDraftId
              ? "Guardar cambios"
              : "Guardar borrador"}
        </button>

        <button
          type="button"
          className="is-publish"
          disabled={
            isBusy ||
            !currentDraft ||
            isDirty ||
            resolvedProductIds.length ===
              0
          }
          title={
            isDirty
              ? "Guarda los cambios antes de publicar."
              : resolvedProductIds.length ===
                  0
                ? "No se puede publicar un catálogo vacío."
                : "Convertir este borrador en catálogo publicado."
          }
          onClick={() =>
            void publishDraft()
          }
        >
          Publicar catálogo
        </button>

        <button
          type="button"
          disabled={
            isBusy ||
            !currentDraft ||
            isDirty
          }
          onClick={() =>
            void duplicateDraft()
          }
        >
          Duplicar
        </button>

        <button
          type="button"
          className="is-danger"
          disabled={
            isBusy ||
            !currentDraft ||
            isDirty
          }
          onClick={() =>
            void archiveDraft()
          }
        >
          Archivar
        </button>

        <button
          type="button"
          disabled={
            isBusy
          }
          onClick={
            startNew
          }
        >
          Nuevo catálogo
        </button>
      </div>

      {message ? (
        <div
          className="catalog-draft-manager__message"
          role="status"
        >
          {message}
        </div>
      ) : null}

      {error ? (
        <div
          className="catalog-draft-manager__error"
          role="alert"
        >
          {error}
        </div>
      ) : null}
    </section>
  );
}