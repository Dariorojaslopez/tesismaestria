import { toTaxonomyData, type TaxonomyData } from "@/lib/db/mappers";
import { prisma } from "@/lib/prisma";

export async function findTaxonomy(): Promise<TaxonomyData> {
  const [hairTypes, afroSubTypes, symptoms] = await Promise.all([
    prisma.hairType.findMany(),
    prisma.afroSubType.findMany(),
    prisma.formSymptom.findMany(),
  ]);

  return toTaxonomyData(hairTypes, afroSubTypes, symptoms);
}
