#!/usr/bin/env node
/**
 * Backfill script to populate bilingual translations for candle documents.
 *
 * Usage:
 *   GOOGLE_APPLICATION_CREDENTIALS=path/to/serviceAccount.json npm run backfill:translations
 *
 * The script reads every document in the `test` collection, ensures that
 * `translations.name`, `translations.description`, and `translations.category`
 * contain both `es` and `en` values, translating from Spanish to English when
 * necessary. If a translation already exists, it is preserved.
 */

const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");

const COLLECTION_NAME = "test";

function resolveServiceAccount() {
  const serviceAccountPath =
    process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!serviceAccountPath) {
    throw new Error(
      "Debes definir la variable de entorno GOOGLE_APPLICATION_CREDENTIALS (o FIREBASE_SERVICE_ACCOUNT) con la ruta del JSON de servicio de Firebase."
    );
  }

  const absolutePath = path.isAbsolute(serviceAccountPath)
    ? serviceAccountPath
    : path.join(process.cwd(), serviceAccountPath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`No se encontró el archivo de credenciales en: ${absolutePath}`);
  }

  const serviceAccountContent = fs.readFileSync(absolutePath, "utf8");
  return JSON.parse(serviceAccountContent);
}

async function translateToEnglish(text) {
  if (!text || !text.trim()) {
    return "";
  }

  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=en&dt=t&q=${encodeURIComponent(
        text
      )}`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    if (Array.isArray(data?.[0])) {
      return data[0].map((segment) => segment?.[0]).join("");
    }

    return text;
  } catch (error) {
    console.error("Error al traducir texto:", error);
    return text;
  }
}

async function backfillTranslations() {
  const serviceAccount = resolveServiceAccount();

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  const db = admin.firestore();
  const snapshot = await db.collection(COLLECTION_NAME).get();

  console.log(`Encontrados ${snapshot.size} documentos en ${COLLECTION_NAME}.`);

  let updatedDocuments = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const translations = data.translations || {};

    const nameEs = translations?.name?.es ?? data.name ?? "";
    const nameEnOriginal = translations?.name?.en;

    const descriptionEs = translations?.description?.es ?? data.description ?? "";
    const descriptionEnOriginal = translations?.description?.en;

    const categoryEs = translations?.category?.es ?? data.category ?? "";
    const categoryEnOriginal = translations?.category?.en;

    const nameEn =
      nameEnOriginal && nameEnOriginal.trim()
        ? nameEnOriginal
        : await translateToEnglish(nameEs || data.name || "");
    const descriptionEn =
      descriptionEnOriginal && descriptionEnOriginal.trim()
        ? descriptionEnOriginal
        : await translateToEnglish(descriptionEs || data.description || "");
    const categoryEn =
      categoryEnOriginal && categoryEnOriginal.trim()
        ? categoryEnOriginal
        : await translateToEnglish(categoryEs || data.category || "");

    const updatedPayload = {
      name: nameEs || data.name || "",
      description: descriptionEs || data.description || "",
      category: categoryEs || data.category || "",
      translations: {
        name: {
          es: nameEs || data.name || "",
          en: nameEn || nameEs || data.name || "",
        },
        description: {
          es: descriptionEs || data.description || "",
          en: descriptionEn || descriptionEs || data.description || "",
        },
        category: {
          es: categoryEs || data.category || "",
          en: categoryEn || categoryEs || data.category || "",
        },
      },
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await doc.ref.update(updatedPayload);
    updatedDocuments += 1;

    // Pausa breve para evitar throttling del servicio de traducción gratuito.
    await new Promise((resolve) => setTimeout(resolve, 200));

    console.log(`Documento ${doc.id} actualizado con traducciones.`);
  }

  console.log(`Proceso completado. Documentos actualizados: ${updatedDocuments}`);
}

backfillTranslations()
  .then(() => {
    console.log("Backfill finalizado con éxito.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error durante el backfill de traducciones:", error);
    process.exit(1);
  });


