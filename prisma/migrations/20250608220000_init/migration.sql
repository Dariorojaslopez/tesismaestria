-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "treatments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "vitamins" TEXT,
    "chemically_treated_note" TEXT,
    "general_note" TEXT,
    "image_num" INTEGER,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "treatments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "treatment_ingredients" (
    "id" SERIAL NOT NULL,
    "treatment_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "treatment_ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "treatment_benefits" (
    "id" SERIAL NOT NULL,
    "treatment_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "treatment_benefits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "treatment_symptoms" (
    "id" SERIAL NOT NULL,
    "treatment_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "treatment_symptoms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "afro_benefits" (
    "id" SERIAL NOT NULL,
    "treatment_id" TEXT NOT NULL,
    "sub_type" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "afro_benefits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hair_types" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "hair_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "afro_sub_types" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "afro_sub_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_symptoms" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "form_symptoms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diagnosis_sessions" (
    "id" TEXT NOT NULL,
    "hair_type" TEXT,
    "hair_type_label" TEXT,
    "afro_sub_type" TEXT,
    "explanation" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "diagnosis_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diagnosis_symptom_entries" (
    "id" SERIAL NOT NULL,
    "session_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "diagnosis_symptom_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diagnosis_recommendations" (
    "id" SERIAL NOT NULL,
    "session_id" TEXT NOT NULL,
    "treatment_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,

    CONSTRAINT "diagnosis_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "afro_benefits_treatment_id_sub_type_key" ON "afro_benefits"("treatment_id", "sub_type");

-- CreateIndex
CREATE UNIQUE INDEX "form_symptoms_value_key" ON "form_symptoms"("value");

-- AddForeignKey
ALTER TABLE "treatment_ingredients" ADD CONSTRAINT "treatment_ingredients_treatment_id_fkey" FOREIGN KEY ("treatment_id") REFERENCES "treatments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "treatment_benefits" ADD CONSTRAINT "treatment_benefits_treatment_id_fkey" FOREIGN KEY ("treatment_id") REFERENCES "treatments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "treatment_symptoms" ADD CONSTRAINT "treatment_symptoms_treatment_id_fkey" FOREIGN KEY ("treatment_id") REFERENCES "treatments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "afro_benefits" ADD CONSTRAINT "afro_benefits_treatment_id_fkey" FOREIGN KEY ("treatment_id") REFERENCES "treatments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnosis_symptom_entries" ADD CONSTRAINT "diagnosis_symptom_entries_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "diagnosis_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnosis_recommendations" ADD CONSTRAINT "diagnosis_recommendations_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "diagnosis_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnosis_recommendations" ADD CONSTRAINT "diagnosis_recommendations_treatment_id_fkey" FOREIGN KEY ("treatment_id") REFERENCES "treatments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
