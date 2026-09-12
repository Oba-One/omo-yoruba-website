// Every object, singleton and document type, registered in one array (CONTENT-MODEL sections 2
// to 4 as amended by ADR 0013 to 0017). Order: shared objects, then documents.
import type { SchemaTypeDefinition } from 'sanity';
import { contentDocumentTypes, enquiry, enquiryFieldTypes, subscriber } from './documents';
import {
  bilingual,
  blockContent,
  contactRole,
  cta,
  fact,
  faqItem,
  oyImage,
  pageHeader,
  pullQuote,
  scheduleItem,
  seo,
  sourcedFigure,
} from './objects';
import { SINGLETON_NAMES, singletonTypes } from './singletons';

export const objectTypes: SchemaTypeDefinition[] = [
  bilingual,
  cta,
  oyImage,
  seo,
  fact,
  sourcedFigure,
  scheduleItem,
  faqItem,
  contactRole,
  pullQuote,
  blockContent,
  pageHeader,
  ...enquiryFieldTypes,
];

export const documentTypes: SchemaTypeDefinition[] = [
  ...singletonTypes,
  ...contentDocumentTypes,
  enquiry,
  subscriber,
];

export const schemaTypes: SchemaTypeDefinition[] = [...objectTypes, ...documentTypes];

export { SINGLETON_NAMES };
