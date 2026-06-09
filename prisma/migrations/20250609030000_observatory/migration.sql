-- CreateTable
CREATE TABLE "observatory_surveys" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age_range" TEXT,
    "city" TEXT NOT NULL,
    "email" TEXT,
    "hair_type" TEXT NOT NULL,
    "afro_sub_type" TEXT,
    "wash_frequency" TEXT,
    "uses_heat" BOOLEAN NOT NULL DEFAULT false,
    "uses_chemicals" BOOLEAN NOT NULL DEFAULT false,
    "care_routine" TEXT,
    "natural_products_interest" TEXT,
    "wants_recommendations" BOOLEAN NOT NULL DEFAULT true,
    "wants_newsletter" BOOLEAN NOT NULL DEFAULT false,
    "purchase_intent" TEXT,
    "compatibility_percent" INTEGER NOT NULL,
    "accepted_recommendation" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "observatory_surveys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "observatory_survey_symptoms" (
    "id" SERIAL NOT NULL,
    "survey_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "observatory_survey_symptoms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "observatory_survey_recommendations" (
    "id" SERIAL NOT NULL,
    "survey_id" TEXT NOT NULL,
    "treatment_id" TEXT NOT NULL,
    "treatment_name" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,

    CONSTRAINT "observatory_survey_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "observatory_surveys_city_idx" ON "observatory_surveys"("city");

-- CreateIndex
CREATE INDEX "observatory_surveys_created_at_idx" ON "observatory_surveys"("created_at");

-- AddForeignKey
ALTER TABLE "observatory_survey_symptoms" ADD CONSTRAINT "observatory_survey_symptoms_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "observatory_surveys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "observatory_survey_recommendations" ADD CONSTRAINT "observatory_survey_recommendations_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "observatory_surveys"("id") ON DELETE CASCADE ON UPDATE CASCADE;
