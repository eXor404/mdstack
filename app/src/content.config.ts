import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const source = process.env.MD_SOURCE;
if (!source) {
  throw new Error(
    'MD_SOURCE env var not set. Run mdstack via the CLI (e.g. `npx mdstack ./your-folder`).'
  );
}

const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: source }),
  schema: z.object({
    title: z.string().optional(),
    order: z.number().optional(),
  }),
});

export const collections = { docs };
