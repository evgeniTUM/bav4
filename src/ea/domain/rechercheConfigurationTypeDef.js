/**
 * @module ea/domain/rechercheConfigurationTypeDef
 */

/**
 * @readonly
 * @enum { number }
 */
const enum_operation = {
	ADD: 1,
	OR: 2
};

/** @typedef {enum_operation}OPERATION_KEYS  {'ADD'|'OR'}
 *
 */

/**
 * @readonly
 * @enum { number }
 */
const enum_sorting = {
	ASC: 1,
	DESC: 2
};

/** @typedef {enum_sorting} SORTING_KEYS {'ASC'|'DESC'}
 */

/**
 * Enum for type of possible values
 * @readonly
 * @enum { number }
 */
const enum_types = {
	NUMERIC: 1,
	INTEGER: 2,
	DATE: 3,
	CHARACTER: 4,
	GEOMETRY: 5,
	VERWKZ: 6,
	MARKUP: 7,
	EMAIL: 8,
	TELEFON: 9
};

/** @typedef {enum_types} TYPE_KEYS possible values : { NUMERIC | INTEGER | DATE | CHARACTER | GEOMETRY |VERWKZ |MARKUP | EMAIL | TELEFON }*/

/**
 * @typedef Child
 * @property {string} key
 * @property {string} name
 * @property {string} ewkt
 * @property {number} type
 * @property {Array<Child>} children
 */

/**
 * @typedef AdminRegionTree
 * @property {string} key
 * @property {string} name
 * @property {string} ewkt
 * @property {number} type
 * @property {Array<Child>} children
 */

/**
 * @typedef FeatureProperty
 * @property {String} originalKey
 * @property {String} value
 */

/**
 * @typedef Feature
 * @property {string} featureId
 * @property {string} geometry
 * @property {string} geoResourceId
 * @property {Array<FeatureProperty>} featureProperties
 */

/**
 * @typedef Theme
 * @property {number} themeId
 * @property {string} displayName
 * @property {string} geoResourceId
 * @property {number} featureResourceId
 */

/**
 * @typedef Themegroup .an EE group ("Erneuerbare Energie")
 * @property {string} groupName The name of EE group of a recherche-group per example Energie, Biomasse, Sonnenenergie
 * @property {Array<Theme>} themes
 */

/**
 * @typedef PropertyFilter
 * @property {string} originalKey
 * @property {TYPE_KEYS} type
 * @property {OPERATION_KEYS } filterOperation
 * @property {Array<string>} operands
 * @property {number} min
 * @property {number} max
 * @property {string} values
 */

/**
 * @typedef PropertyDefinition
 * @property {string} originalKey
 * @property {string} displayName
 * @property {TYPE_KEYS} type
 * @property {SORTING_KEYS} sortDirections
 * @property {Array<string>} scopeFilters
 * @property {Array<string>} values
 * @property {number} min
 * @property {number} max
 */

/**
 *  @typedef ThemeMetadata
 * @property {number} themeId;
 * @property {number} featureCount
 * @property {Array<PropertyDefinition>} propertyDefinitions
 */

/**
 * @typedef Sorting
 * @property {string} originalKey
 * @property {SORTING_KEYS} sortDirections
 *
 */

/**
 * @typedef FeatureRequest
 * @property {string} featureResourceId
 * @property {number} srid
 * @property {number} page
 * @property {number} pageSize
 * @property {number} themeId
 * @property {Sorting} sorting
 * @property {Array<number>} regionFilters
 * @property {PropertyFilter} propertyFilters
 *
 */

/**
 * @typedef FeatureResponse
 * @property {FeatureRequest} featuresRequest
 * @property {Array<Feature>} features
 */
