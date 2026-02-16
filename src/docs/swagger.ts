const port = process.env.PORT || 3000;

// Build tags array (duplicates are harmless, but we could dedupe if needed)
const tags: Array<{name: string, description: string}> = [
  { name: "VolumeServices", description: "VolumeServices operations" },
  { name: "CustomerSatisfactions", description: "CustomerSatisfactions operations" },
  { name: "Kpis", description: "Kpis operations" },
  { name: "TargetRealities", description: "TargetRealities operations" },
  { name: "Revenues", description: "Revenues operations" },
  { name: "VisitorInsights", description: "VisitorInsights operations" },
  { name: "TopProducts", description: "TopProducts operations" },
  { name: "SalesMaps", description: "SalesMaps operations" },
];

// Helper function to convert field type to OpenAPI type
function getOpenAPIType(fieldType: string): string {
  const typeMap: Record<string, string> = {
    string: 'string', text: 'string', uuid: 'string',
    int: 'integer', integer: 'integer',
    float: 'number', decimal: 'number', number: 'number',
    boolean: 'boolean', bool: 'boolean',
    date: 'string', datetime: 'string',
    json: 'object', object: 'object',
  };
  return typeMap[fieldType] || 'string';
}

// Helper to generate example value for a field
function getExampleValue(field: any): any {
  if (field.enum && field.enum.length > 0) return field.enum[0];
  if (field.default) {
    // Handle Prisma defaults like uuid(), now(), etc.
    if (field.default === 'uuid()') return '123e4567-e89b-12d3-a456-426614174000';
    if (field.default === 'now()') return new Date().toISOString();
    return field.default;
  }
  
  // Smart examples based on field name
  const fieldName = field.name.toLowerCase();
  if (fieldName.includes('email')) return 'user@example.com';
  if (fieldName.includes('name')) return 'John Doe';
  if (fieldName.includes('username')) return 'johndoe';
  if (fieldName.includes('password')) return 'password123';
  if (fieldName.includes('phone')) return '+1234567890';
  if (fieldName.includes('age')) return 25;
  if (fieldName.includes('price') || fieldName.includes('amount')) return 99.99;
  if (fieldName.includes('url') || fieldName.includes('link')) return 'https://example.com';
  if (fieldName.includes('description') || fieldName.includes('bio')) return 'Sample description';
  if (fieldName.includes('title')) return 'Sample Title';
  if (fieldName.includes('content') || fieldName.includes('body')) return 'Sample content';
  if (fieldName.includes('status')) return 'active';
  if (fieldName.includes('role')) return 'user';
  if (fieldName.includes('published')) return true;
  
  const typeExamples: Record<string, any> = {
    string: 'string', text: 'Sample text', uuid: '123e4567-e89b-12d3-a456-426614174000',
    int: 0, integer: 0, number: 0, float: 0.0, decimal: 0.0,
    boolean: false, bool: false,
    date: new Date().toISOString().split('T')[0],
    datetime: new Date().toISOString(),
    json: {},
    object: {},
  };
  
  const example = typeExamples[field.type] || 'string';
  return field.is_array ? [example] : example;
}

// Helper to build field schema
function buildFieldSchema(field: any): any {
  const schema: any = { type: getOpenAPIType(field.type) };
  if (field.is_array) {
    const itemType = getOpenAPIType(field.type);
    schema.type = 'array';
    schema.items = { type: itemType };
    schema.example = [getExampleValue(field)];
  } else {
    if (field.type === 'datetime') schema.format = 'date-time';
    if (field.type === 'date') schema.format = 'date';
    schema.example = getExampleValue(field);
  }
  if (field.description) schema.description = field.description;
  if (field.enum) schema.enum = field.enum;
  return schema;
}

// Build components with schemas programmatically to avoid duplicate keys
const components: any = {
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
  schemas: {},
};

// Add a default Error schema used in responses
components.schemas.Error = {
  type: 'object',
  properties: {
    message: { type: 'string' },
    error: { oneOf: [ { type: 'string' }, { type: 'object' }, { type: 'array' } ] },
  },
};

// Auto-generate schemas from models
(function() {
  const modelFields = [{"default": null, "enum": [], "is_array": false, "is_primary_key": true, "name": "id", "reference": null, "required": true, "type": "uuid", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "serviceName", "reference": null, "required": true, "type": "string", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "serviceType", "reference": null, "required": true, "type": "string", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "usageCount", "reference": null, "required": true, "type": "integer", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "averageResponseTime", "reference": null, "required": true, "type": "float", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "successRate", "reference": null, "required": true, "type": "decimal", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "errorRate", "reference": null, "required": true, "type": "decimal", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "metadata", "reference": null, "required": true, "type": "json", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "recordedAt", "reference": null, "required": true, "type": "datetime", "unique": false}, {"default": "true", "enum": [], "is_array": false, "is_primary_key": false, "name": "isActive", "reference": null, "required": true, "type": "boolean", "unique": false}];
  const autoGeneratedFields = ['createdAt', 'updatedAt', 'deletedAt'];
  
  // Full schema (for responses)
  const fullProps: any = {};
  const createProps: any = {};
  const updateProps: any = {};
  const requiredCreate: string[] = [];
  
  modelFields.forEach((field: any) => {
    // Skip relationship fields (they're virtual)
    if (field.reference) return;
    
    const fieldSchema = buildFieldSchema(field);
    const isAutoGen = field.is_primary_key || autoGeneratedFields.includes(field.name);
    
    // Add to full schema (all fields)
    fullProps[field.name] = fieldSchema;
    
    // Add to create schema (exclude auto-generated)
    if (!isAutoGen) {
      createProps[field.name] = fieldSchema;
      if (field.required) {
        requiredCreate.push(field.name);
      }
    }
    
    // Add to update schema (all optional, exclude auto-generated)
    if (!isAutoGen) {
      updateProps[field.name] = fieldSchema;
    }
  });
  
components.schemas["VolumeService"] = {
  type: 'object',
    properties: fullProps,
  };
  
  components.schemas["VolumeServiceCreate"] = {
    type: 'object',
    properties: createProps,
    required: requiredCreate,
  };
  
  components.schemas["VolumeServiceUpdate"] = {
    type: 'object',
    properties: updateProps,
  };
})();
(function() {
  const modelFields = [{"default": null, "enum": [], "is_array": false, "is_primary_key": true, "name": "id", "reference": null, "required": true, "type": "uuid", "unique": true}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "date", "reference": null, "required": true, "type": "date", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "dailyScore", "reference": null, "required": true, "type": "float", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "previousMonthAverage", "reference": null, "required": true, "type": "float", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "currentMonthAverage", "reference": null, "required": true, "type": "float", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "comparisonPercent", "reference": null, "required": true, "type": "float", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "feedbackSummary", "reference": null, "required": true, "type": "text", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "metadata", "reference": null, "required": true, "type": "json", "unique": false}, {"default": "true", "enum": [], "is_array": false, "is_primary_key": false, "name": "isActive", "reference": null, "required": true, "type": "boolean", "unique": false}];
  const autoGeneratedFields = ['createdAt', 'updatedAt', 'deletedAt'];
  
  // Full schema (for responses)
  const fullProps: any = {};
  const createProps: any = {};
  const updateProps: any = {};
  const requiredCreate: string[] = [];
  
  modelFields.forEach((field: any) => {
    // Skip relationship fields (they're virtual)
    if (field.reference) return;
    
    const fieldSchema = buildFieldSchema(field);
    const isAutoGen = field.is_primary_key || autoGeneratedFields.includes(field.name);
    
    // Add to full schema (all fields)
    fullProps[field.name] = fieldSchema;
    
    // Add to create schema (exclude auto-generated)
    if (!isAutoGen) {
      createProps[field.name] = fieldSchema;
      if (field.required) {
        requiredCreate.push(field.name);
      }
    }
    
    // Add to update schema (all optional, exclude auto-generated)
    if (!isAutoGen) {
      updateProps[field.name] = fieldSchema;
    }
  });
  
components.schemas["CustomerSatisfaction"] = {
  type: 'object',
    properties: fullProps,
  };
  
  components.schemas["CustomerSatisfactionCreate"] = {
    type: 'object',
    properties: createProps,
    required: requiredCreate,
  };
  
  components.schemas["CustomerSatisfactionUpdate"] = {
    type: 'object',
    properties: updateProps,
  };
})();
(function() {
  const modelFields = [{"default": null, "enum": [], "is_array": false, "is_primary_key": true, "name": "id", "reference": null, "required": true, "type": "uuid", "unique": true}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "name", "reference": null, "required": true, "type": "string", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "description", "reference": null, "required": true, "type": "text", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "category", "reference": null, "required": true, "type": "string", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "value", "reference": null, "required": true, "type": "decimal", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "unit", "reference": null, "required": true, "type": "string", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "targetValue", "reference": null, "required": true, "type": "decimal", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "growthRate", "reference": null, "required": true, "type": "float", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "periodStart", "reference": null, "required": true, "type": "date", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "periodEnd", "reference": null, "required": true, "type": "date", "unique": false}, {"default": "true", "enum": [], "is_array": false, "is_primary_key": false, "name": "isActive", "reference": null, "required": true, "type": "boolean", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "metadata", "reference": null, "required": true, "type": "json", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "createdAt", "reference": null, "required": true, "type": "datetime", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "updatedAt", "reference": null, "required": true, "type": "datetime", "unique": false}];
  const autoGeneratedFields = ['createdAt', 'updatedAt', 'deletedAt'];
  
  // Full schema (for responses)
  const fullProps: any = {};
  const createProps: any = {};
  const updateProps: any = {};
  const requiredCreate: string[] = [];
  
  modelFields.forEach((field: any) => {
    // Skip relationship fields (they're virtual)
    if (field.reference) return;
    
    const fieldSchema = buildFieldSchema(field);
    const isAutoGen = field.is_primary_key || autoGeneratedFields.includes(field.name);
    
    // Add to full schema (all fields)
    fullProps[field.name] = fieldSchema;
    
    // Add to create schema (exclude auto-generated)
    if (!isAutoGen) {
      createProps[field.name] = fieldSchema;
      if (field.required) {
        requiredCreate.push(field.name);
      }
    }
    
    // Add to update schema (all optional, exclude auto-generated)
    if (!isAutoGen) {
      updateProps[field.name] = fieldSchema;
    }
  });
  
components.schemas["Kpi"] = {
  type: 'object',
    properties: fullProps,
  };
  
  components.schemas["KpiCreate"] = {
    type: 'object',
    properties: createProps,
    required: requiredCreate,
  };
  
  components.schemas["KpiUpdate"] = {
    type: 'object',
    properties: updateProps,
  };
})();
(function() {
  const modelFields = [{"default": null, "enum": [], "is_array": false, "is_primary_key": true, "name": "id", "reference": null, "required": true, "type": "uuid", "unique": true}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "title", "reference": null, "required": true, "type": "string", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "description", "reference": null, "required": true, "type": "text", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "targetValue", "reference": null, "required": true, "type": "decimal", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "actualValue", "reference": null, "required": true, "type": "decimal", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "variance", "reference": null, "required": true, "type": "decimal", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "variancePercentage", "reference": null, "required": true, "type": "float", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "periodStart", "reference": null, "required": true, "type": "date", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "periodEnd", "reference": null, "required": true, "type": "date", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "status", "reference": null, "required": true, "type": "string", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "kpiId", "reference": null, "required": true, "type": "uuid", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "topProductId", "reference": null, "required": true, "type": "uuid", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "visitorInsightId", "reference": null, "required": true, "type": "uuid", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "revenueId", "reference": null, "required": true, "type": "uuid", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "customerSatisfactionId", "reference": null, "required": true, "type": "uuid", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "createdAt", "reference": null, "required": true, "type": "datetime", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "updatedAt", "reference": null, "required": true, "type": "datetime", "unique": false}, {"default": "true", "enum": [], "is_array": false, "is_primary_key": false, "name": "isActive", "reference": null, "required": true, "type": "boolean", "unique": false}];
  const autoGeneratedFields = ['createdAt', 'updatedAt', 'deletedAt'];
  
  // Full schema (for responses)
  const fullProps: any = {};
  const createProps: any = {};
  const updateProps: any = {};
  const requiredCreate: string[] = [];
  
  modelFields.forEach((field: any) => {
    // Skip relationship fields (they're virtual)
    if (field.reference) return;
    
    const fieldSchema = buildFieldSchema(field);
    const isAutoGen = field.is_primary_key || autoGeneratedFields.includes(field.name);
    
    // Add to full schema (all fields)
    fullProps[field.name] = fieldSchema;
    
    // Add to create schema (exclude auto-generated)
    if (!isAutoGen) {
      createProps[field.name] = fieldSchema;
      if (field.required) {
        requiredCreate.push(field.name);
      }
    }
    
    // Add to update schema (all optional, exclude auto-generated)
    if (!isAutoGen) {
      updateProps[field.name] = fieldSchema;
    }
  });
  
components.schemas["TargetReality"] = {
  type: 'object',
    properties: fullProps,
  };
  
  components.schemas["TargetRealityCreate"] = {
    type: 'object',
    properties: createProps,
    required: requiredCreate,
  };
  
  components.schemas["TargetRealityUpdate"] = {
    type: 'object',
    properties: updateProps,
  };
})();
(function() {
  const modelFields = [{"default": null, "enum": [], "is_array": false, "is_primary_key": true, "name": "id", "reference": null, "required": true, "type": "uuid", "unique": true}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "channel", "reference": null, "required": true, "type": "string", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "onlineSales", "reference": null, "required": true, "type": "decimal", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "offlineSales", "reference": null, "required": true, "type": "decimal", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "totalRevenue", "reference": null, "required": true, "type": "decimal", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "currency", "reference": null, "required": true, "type": "string", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "periodStart", "reference": null, "required": true, "type": "date", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "periodEnd", "reference": null, "required": true, "type": "date", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "notes", "reference": null, "required": true, "type": "text", "unique": false}, {"default": "false", "enum": [], "is_array": false, "is_primary_key": false, "name": "isForecast", "reference": null, "required": true, "type": "boolean", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "createdAt", "reference": null, "required": true, "type": "datetime", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "updatedAt", "reference": null, "required": true, "type": "datetime", "unique": false}];
  const autoGeneratedFields = ['createdAt', 'updatedAt', 'deletedAt'];
  
  // Full schema (for responses)
  const fullProps: any = {};
  const createProps: any = {};
  const updateProps: any = {};
  const requiredCreate: string[] = [];
  
  modelFields.forEach((field: any) => {
    // Skip relationship fields (they're virtual)
    if (field.reference) return;
    
    const fieldSchema = buildFieldSchema(field);
    const isAutoGen = field.is_primary_key || autoGeneratedFields.includes(field.name);
    
    // Add to full schema (all fields)
    fullProps[field.name] = fieldSchema;
    
    // Add to create schema (exclude auto-generated)
    if (!isAutoGen) {
      createProps[field.name] = fieldSchema;
      if (field.required) {
        requiredCreate.push(field.name);
      }
    }
    
    // Add to update schema (all optional, exclude auto-generated)
    if (!isAutoGen) {
      updateProps[field.name] = fieldSchema;
    }
  });
  
components.schemas["Revenue"] = {
  type: 'object',
    properties: fullProps,
  };
  
  components.schemas["RevenueCreate"] = {
    type: 'object',
    properties: createProps,
    required: requiredCreate,
  };
  
  components.schemas["RevenueUpdate"] = {
    type: 'object',
    properties: updateProps,
  };
})();
(function() {
  const modelFields = [{"default": null, "enum": [], "is_array": false, "is_primary_key": true, "name": "id", "reference": null, "required": true, "type": "uuid", "unique": true}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "month", "reference": null, "required": true, "type": "string", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "year", "reference": null, "required": true, "type": "integer", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "loyalVisitors", "reference": null, "required": true, "type": "integer", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "newVisitors", "reference": null, "required": true, "type": "integer", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "uniqueVisitors", "reference": null, "required": true, "type": "integer", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "totalVisitors", "reference": null, "required": true, "type": "integer", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "growthRate", "reference": null, "required": true, "type": "float", "unique": false}, {"default": "true", "enum": [], "is_array": false, "is_primary_key": false, "name": "isActive", "reference": null, "required": true, "type": "boolean", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "createdAt", "reference": null, "required": true, "type": "datetime", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "updatedAt", "reference": null, "required": true, "type": "datetime", "unique": false}];
  const autoGeneratedFields = ['createdAt', 'updatedAt', 'deletedAt'];
  
  // Full schema (for responses)
  const fullProps: any = {};
  const createProps: any = {};
  const updateProps: any = {};
  const requiredCreate: string[] = [];
  
  modelFields.forEach((field: any) => {
    // Skip relationship fields (they're virtual)
    if (field.reference) return;
    
    const fieldSchema = buildFieldSchema(field);
    const isAutoGen = field.is_primary_key || autoGeneratedFields.includes(field.name);
    
    // Add to full schema (all fields)
    fullProps[field.name] = fieldSchema;
    
    // Add to create schema (exclude auto-generated)
    if (!isAutoGen) {
      createProps[field.name] = fieldSchema;
      if (field.required) {
        requiredCreate.push(field.name);
      }
    }
    
    // Add to update schema (all optional, exclude auto-generated)
    if (!isAutoGen) {
      updateProps[field.name] = fieldSchema;
    }
  });
  
components.schemas["VisitorInsight"] = {
  type: 'object',
    properties: fullProps,
  };
  
  components.schemas["VisitorInsightCreate"] = {
    type: 'object',
    properties: createProps,
    required: requiredCreate,
  };
  
  components.schemas["VisitorInsightUpdate"] = {
    type: 'object',
    properties: updateProps,
  };
})();
(function() {
  const modelFields = [{"default": null, "enum": [], "is_array": false, "is_primary_key": true, "name": "id", "reference": null, "required": true, "type": "uuid", "unique": true}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "name", "reference": null, "required": true, "type": "string", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "sku", "reference": null, "required": true, "type": "string", "unique": true}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "category", "reference": null, "required": true, "type": "string", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "totalSales", "reference": null, "required": true, "type": "number", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "unitsSold", "reference": null, "required": true, "type": "integer", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "revenue", "reference": null, "required": true, "type": "decimal", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "averageRating", "reference": null, "required": true, "type": "float", "unique": false}, {"default": "true", "enum": [], "is_array": false, "is_primary_key": false, "name": "isActive", "reference": null, "required": true, "type": "boolean", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "periodStart", "reference": null, "required": true, "type": "date", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "periodEnd", "reference": null, "required": true, "type": "date", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "metadata", "reference": null, "required": true, "type": "json", "unique": false}];
  const autoGeneratedFields = ['createdAt', 'updatedAt', 'deletedAt'];
  
  // Full schema (for responses)
  const fullProps: any = {};
  const createProps: any = {};
  const updateProps: any = {};
  const requiredCreate: string[] = [];
  
  modelFields.forEach((field: any) => {
    // Skip relationship fields (they're virtual)
    if (field.reference) return;
    
    const fieldSchema = buildFieldSchema(field);
    const isAutoGen = field.is_primary_key || autoGeneratedFields.includes(field.name);
    
    // Add to full schema (all fields)
    fullProps[field.name] = fieldSchema;
    
    // Add to create schema (exclude auto-generated)
    if (!isAutoGen) {
      createProps[field.name] = fieldSchema;
      if (field.required) {
        requiredCreate.push(field.name);
      }
    }
    
    // Add to update schema (all optional, exclude auto-generated)
    if (!isAutoGen) {
      updateProps[field.name] = fieldSchema;
    }
  });
  
components.schemas["TopProduct"] = {
  type: 'object',
    properties: fullProps,
  };
  
  components.schemas["TopProductCreate"] = {
    type: 'object',
    properties: createProps,
    required: requiredCreate,
  };
  
  components.schemas["TopProductUpdate"] = {
    type: 'object',
    properties: updateProps,
  };
})();
(function() {
  const modelFields = [{"default": null, "enum": [], "is_array": false, "is_primary_key": true, "name": "id", "reference": null, "required": true, "type": "uuid", "unique": true}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "country", "reference": null, "required": true, "type": "string", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "countryCode", "reference": null, "required": true, "type": "string", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "totalSales", "reference": null, "required": true, "type": "decimal", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "currency", "reference": null, "required": true, "type": "string", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "region", "reference": null, "required": true, "type": "string", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "salesBreakdown", "reference": null, "required": true, "type": "json", "unique": false}, {"default": null, "enum": [], "is_array": false, "is_primary_key": false, "name": "recordedDate", "reference": null, "required": true, "type": "date", "unique": false}, {"default": "true", "enum": [], "is_array": false, "is_primary_key": false, "name": "isActive", "reference": null, "required": true, "type": "boolean", "unique": false}];
  const autoGeneratedFields = ['createdAt', 'updatedAt', 'deletedAt'];
  
  // Full schema (for responses)
  const fullProps: any = {};
  const createProps: any = {};
  const updateProps: any = {};
  const requiredCreate: string[] = [];
  
  modelFields.forEach((field: any) => {
    // Skip relationship fields (they're virtual)
    if (field.reference) return;
    
    const fieldSchema = buildFieldSchema(field);
    const isAutoGen = field.is_primary_key || autoGeneratedFields.includes(field.name);
    
    // Add to full schema (all fields)
    fullProps[field.name] = fieldSchema;
    
    // Add to create schema (exclude auto-generated)
    if (!isAutoGen) {
      createProps[field.name] = fieldSchema;
      if (field.required) {
        requiredCreate.push(field.name);
      }
    }
    
    // Add to update schema (all optional, exclude auto-generated)
    if (!isAutoGen) {
      updateProps[field.name] = fieldSchema;
    }
  });
  
components.schemas["SalesMap"] = {
  type: 'object',
    properties: fullProps,
  };
  
  components.schemas["SalesMapCreate"] = {
    type: 'object',
    properties: createProps,
    required: requiredCreate,
  };
  
  components.schemas["SalesMapUpdate"] = {
    type: 'object',
    properties: updateProps,
  };
})();

// Build paths programmatically, merging when the same path appears
const paths: any = {};

// Health check at root
paths['/'] = { get: { summary: 'Health check', responses: { '200': { description: 'OK' } } } };


(function(){
  const base = "/volume-services";
  const sub = "/";
  const fullPath = `${base}${sub}`;
  const method = "get";
  paths[fullPath] = paths[fullPath] || {};
  const op: any = {
    tags: ["VolumeServices"],
    summary: null,
    responses: {
      '200': { description: 'Successful response' },
      '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  };
  // Build parameters (path + query)
  const params: any[] = [];
  if (params.length) op.parameters = params;
  paths[fullPath][method] = op;
})();
(function(){
  const base = "/volume-services";
  const sub = "/";
  const fullPath = `${base}${sub}`;
  const method = "post";
  paths[fullPath] = paths[fullPath] || {};
  const op: any = {
    tags: ["VolumeServices"],
    summary: null,
    responses: {
      '200': { description: 'Successful response' },
      '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  };
  // Build parameters (path + query)
  const params: any[] = [];
  if (params.length) op.parameters = params;
  op.requestBody = {
    required: true,
    content: { 'application/json': { schema: { $ref: '#/components/schemas/VolumeServiceCreate' } } },
  };
  paths[fullPath][method] = op;
})();
(function(){
  const base = "/volume-services";
  const sub = "/:id";
  const fullPath = `${base}${sub}`;
  const method = "delete";
  paths[fullPath] = paths[fullPath] || {};
  const op: any = {
    tags: ["VolumeServices"],
    summary: null,
    responses: {
      '200': { description: 'Successful response' },
      '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  };
  // Build parameters (path + query)
  const params: any[] = [];
  params.push({ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Resource ID' });
  if (params.length) op.parameters = params;
  paths[fullPath][method] = op;
})();
(function(){
  const base = "/volume-services";
  const sub = "/:id";
  const fullPath = `${base}${sub}`;
  const method = "get";
  paths[fullPath] = paths[fullPath] || {};
  const op: any = {
    tags: ["VolumeServices"],
    summary: null,
    responses: {
      '200': { description: 'Successful response' },
      '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  };
  // Build parameters (path + query)
  const params: any[] = [];
  params.push({ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Resource ID' });
  if (params.length) op.parameters = params;
  paths[fullPath][method] = op;
})();
(function(){
  const base = "/volume-services";
  const sub = "/:id";
  const fullPath = `${base}${sub}`;
  const method = "put";
  paths[fullPath] = paths[fullPath] || {};
  const op: any = {
    tags: ["VolumeServices"],
    summary: null,
    responses: {
      '200': { description: 'Successful response' },
      '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  };
  // Build parameters (path + query)
  const params: any[] = [];
  params.push({ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Resource ID' });
  if (params.length) op.parameters = params;
  op.requestBody = {
    required: true,
    content: { 'application/json': { schema: { $ref: '#/components/schemas/VolumeServiceUpdate' } } },
  };
  paths[fullPath][method] = op;
})();
(function(){
  const base = "/customer-satisfactions";
  const sub = "/";
  const fullPath = `${base}${sub}`;
  const method = "get";
  paths[fullPath] = paths[fullPath] || {};
  const op: any = {
    tags: ["CustomerSatisfactions"],
    summary: null,
    responses: {
      '200': { description: 'Successful response' },
      '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  };
  // Build parameters (path + query)
  const params: any[] = [];
  if (params.length) op.parameters = params;
  paths[fullPath][method] = op;
})();
(function(){
  const base = "/customer-satisfactions";
  const sub = "/";
  const fullPath = `${base}${sub}`;
  const method = "post";
  paths[fullPath] = paths[fullPath] || {};
  const op: any = {
    tags: ["CustomerSatisfactions"],
    summary: null,
    responses: {
      '200': { description: 'Successful response' },
      '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  };
  // Build parameters (path + query)
  const params: any[] = [];
  if (params.length) op.parameters = params;
  op.requestBody = {
    required: true,
    content: { 'application/json': { schema: { $ref: '#/components/schemas/CustomerSatisfactionCreate' } } },
  };
  paths[fullPath][method] = op;
})();
(function(){
  const base = "/customer-satisfactions";
  const sub = "/:id";
  const fullPath = `${base}${sub}`;
  const method = "delete";
  paths[fullPath] = paths[fullPath] || {};
  const op: any = {
    tags: ["CustomerSatisfactions"],
    summary: null,
    responses: {
      '200': { description: 'Successful response' },
      '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  };
  // Build parameters (path + query)
  const params: any[] = [];
  params.push({ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Resource ID' });
  if (params.length) op.parameters = params;
  paths[fullPath][method] = op;
})();
(function(){
  const base = "/customer-satisfactions";
  const sub = "/:id";
  const fullPath = `${base}${sub}`;
  const method = "get";
  paths[fullPath] = paths[fullPath] || {};
  const op: any = {
    tags: ["CustomerSatisfactions"],
    summary: null,
    responses: {
      '200': { description: 'Successful response' },
      '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  };
  // Build parameters (path + query)
  const params: any[] = [];
  params.push({ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Resource ID' });
  if (params.length) op.parameters = params;
  paths[fullPath][method] = op;
})();
(function(){
  const base = "/customer-satisfactions";
  const sub = "/:id";
  const fullPath = `${base}${sub}`;
  const method = "put";
  paths[fullPath] = paths[fullPath] || {};
  const op: any = {
    tags: ["CustomerSatisfactions"],
    summary: null,
    responses: {
      '200': { description: 'Successful response' },
      '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  };
  // Build parameters (path + query)
  const params: any[] = [];
  params.push({ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Resource ID' });
  if (params.length) op.parameters = params;
  op.requestBody = {
    required: true,
    content: { 'application/json': { schema: { $ref: '#/components/schemas/CustomerSatisfactionUpdate' } } },
  };
  paths[fullPath][method] = op;
})();
(function(){
  const base = "/kpis";
  const sub = "/";
  const fullPath = `${base}${sub}`;
  const method = "get";
  paths[fullPath] = paths[fullPath] || {};
  const op: any = {
    tags: ["Kpis"],
    summary: null,
    responses: {
      '200': { description: 'Successful response' },
      '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  };
  // Build parameters (path + query)
  const params: any[] = [];
  if (params.length) op.parameters = params;
  paths[fullPath][method] = op;
})();
(function(){
  const base = "/kpis";
  const sub = "/";
  const fullPath = `${base}${sub}`;
  const method = "post";
  paths[fullPath] = paths[fullPath] || {};
  const op: any = {
    tags: ["Kpis"],
    summary: null,
    responses: {
      '200': { description: 'Successful response' },
      '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  };
  // Build parameters (path + query)
  const params: any[] = [];
  if (params.length) op.parameters = params;
  op.requestBody = {
    required: true,
    content: { 'application/json': { schema: { $ref: '#/components/schemas/KpiCreate' } } },
  };
  paths[fullPath][method] = op;
})();
(function(){
  const base = "/kpis";
  const sub = "/:id";
  const fullPath = `${base}${sub}`;
  const method = "delete";
  paths[fullPath] = paths[fullPath] || {};
  const op: any = {
    tags: ["Kpis"],
    summary: null,
    responses: {
      '200': { description: 'Successful response' },
      '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  };
  // Build parameters (path + query)
  const params: any[] = [];
  params.push({ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Resource ID' });
  if (params.length) op.parameters = params;
  paths[fullPath][method] = op;
})();
(function(){
  const base = "/kpis";
  const sub = "/:id";
  const fullPath = `${base}${sub}`;
  const method = "get";
  paths[fullPath] = paths[fullPath] || {};
  const op: any = {
    tags: ["Kpis"],
    summary: null,
    responses: {
      '200': { description: 'Successful response' },
      '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  };
  // Build parameters (path + query)
  const params: any[] = [];
  params.push({ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Resource ID' });
  if (params.length) op.parameters = params;
  paths[fullPath][method] = op;
})();
(function(){
  const base = "/kpis";
  const sub = "/:id";
  const fullPath = `${base}${sub}`;
  const method = "put";
  paths[fullPath] = paths[fullPath] || {};
  const op: any = {
    tags: ["Kpis"],
    summary: null,
    responses: {
      '200': { description: 'Successful response' },
      '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  };
  // Build parameters (path + query)
  const params: any[] = [];
  params.push({ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Resource ID' });
  if (params.length) op.parameters = params;
  op.requestBody = {
    required: true,
    content: { 'application/json': { schema: { $ref: '#/components/schemas/KpiUpdate' } } },
  };
  paths[fullPath][method] = op;
})();
(function(){
  const base = "/target-realities";
  const sub = "/";
  const fullPath = `${base}${sub}`;
  const method = "get";
  paths[fullPath] = paths[fullPath] || {};
  const op: any = {
    tags: ["TargetRealities"],
    summary: null,
    responses: {
      '200': { description: 'Successful response' },
      '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  };
  // Build parameters (path + query)
  const params: any[] = [];
  if (params.length) op.parameters = params;
  paths[fullPath][method] = op;
})();
(function(){
  const base = "/target-realities";
  const sub = "/";
  const fullPath = `${base}${sub}`;
  const method = "post";
  paths[fullPath] = paths[fullPath] || {};
  const op: any = {
    tags: ["TargetRealities"],
    summary: null,
    responses: {
      '200': { description: 'Successful response' },
      '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  };
  // Build parameters (path + query)
  const params: any[] = [];
  if (params.length) op.parameters = params;
  op.requestBody = {
    required: true,
    content: { 'application/json': { schema: { $ref: '#/components/schemas/TargetRealityCreate' } } },
  };
  paths[fullPath][method] = op;
})();
(function(){
  const base = "/target-realities";
  const sub = "/:id";
  const fullPath = `${base}${sub}`;
  const method = "delete";
  paths[fullPath] = paths[fullPath] || {};
  const op: any = {
    tags: ["TargetRealities"],
    summary: null,
    responses: {
      '200': { description: 'Successful response' },
      '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  };
  // Build parameters (path + query)
  const params: any[] = [];
  params.push({ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Resource ID' });
  if (params.length) op.parameters = params;
  paths[fullPath][method] = op;
})();
(function(){
  const base = "/target-realities";
  const sub = "/:id";
  const fullPath = `${base}${sub}`;
  const method = "get";
  paths[fullPath] = paths[fullPath] || {};
  const op: any = {
    tags: ["TargetRealities"],
    summary: null,
    responses: {
      '200': { description: 'Successful response' },
      '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  };
  // Build parameters (path + query)
  const params: any[] = [];
  params.push({ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Resource ID' });
  if (params.length) op.parameters = params;
  paths[fullPath][method] = op;
})();
(function(){
  const base = "/target-realities";
  const sub = "/:id";
  const fullPath = `${base}${sub}`;
  const method = "put";
  paths[fullPath] = paths[fullPath] || {};
  const op: any = {
    tags: ["TargetRealities"],
    summary: null,
    responses: {
      '200': { description: 'Successful response' },
      '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  };
  // Build parameters (path + query)
  const params: any[] = [];
  params.push({ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Resource ID' });
  if (params.length) op.parameters = params;
  op.requestBody = {
    required: true,
    content: { 'application/json': { schema: { $ref: '#/components/schemas/TargetRealityUpdate' } } },
  };
  paths[fullPath][method] = op;
})();
(function(){
  const base = "/revenues";
  const sub = "/";
  const fullPath = `${base}${sub}`;
  const method = "get";
  paths[fullPath] = paths[fullPath] || {};
  const op: any = {
    tags: ["Revenues"],
    summary: null,
    responses: {
      '200': { description: 'Successful response' },
      '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  };
  // Build parameters (path + query)
  const params: any[] = [];
  if (params.length) op.parameters = params;
  paths[fullPath][method] = op;
})();
(function(){
  const base = "/revenues";
  const sub = "/";
  const fullPath = `${base}${sub}`;
  const method = "post";
  paths[fullPath] = paths[fullPath] || {};
  const op: any = {
    tags: ["Revenues"],
    summary: null,
    responses: {
      '200': { description: 'Successful response' },
      '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  };
  // Build parameters (path + query)
  const params: any[] = [];
  if (params.length) op.parameters = params;
  op.requestBody = {
    required: true,
    content: { 'application/json': { schema: { $ref: '#/components/schemas/RevenueCreate' } } },
  };
  paths[fullPath][method] = op;
})();
(function(){
  const base = "/revenues";
  const sub = "/:id";
  const fullPath = `${base}${sub}`;
  const method = "delete";
  paths[fullPath] = paths[fullPath] || {};
  const op: any = {
    tags: ["Revenues"],
    summary: null,
    responses: {
      '200': { description: 'Successful response' },
      '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  };
  // Build parameters (path + query)
  const params: any[] = [];
  params.push({ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Resource ID' });
  if (params.length) op.parameters = params;
  paths[fullPath][method] = op;
})();
(function(){
  const base = "/revenues";
  const sub = "/:id";
  const fullPath = `${base}${sub}`;
  const method = "get";
  paths[fullPath] = paths[fullPath] || {};
  const op: any = {
    tags: ["Revenues"],
    summary: null,
    responses: {
      '200': { description: 'Successful response' },
      '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  };
  // Build parameters (path + query)
  const params: any[] = [];
  params.push({ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Resource ID' });
  if (params.length) op.parameters = params;
  paths[fullPath][method] = op;
})();
(function(){
  const base = "/revenues";
  const sub = "/:id";
  const fullPath = `${base}${sub}`;
  const method = "put";
  paths[fullPath] = paths[fullPath] || {};
  const op: any = {
    tags: ["Revenues"],
    summary: null,
    responses: {
      '200': { description: 'Successful response' },
      '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  };
  // Build parameters (path + query)
  const params: any[] = [];
  params.push({ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Resource ID' });
  if (params.length) op.parameters = params;
  op.requestBody = {
    required: true,
    content: { 'application/json': { schema: { $ref: '#/components/schemas/RevenueUpdate' } } },
  };
  paths[fullPath][method] = op;
})();
(function(){
  const base = "/visitor-insights";
  const sub = "/";
  const fullPath = `${base}${sub}`;
  const method = "get";
  paths[fullPath] = paths[fullPath] || {};
  const op: any = {
    tags: ["VisitorInsights"],
    summary: null,
    responses: {
      '200': { description: 'Successful response' },
      '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  };
  // Build parameters (path + query)
  const params: any[] = [];
  if (params.length) op.parameters = params;
  paths[fullPath][method] = op;
})();
(function(){
  const base = "/visitor-insights";
  const sub = "/";
  const fullPath = `${base}${sub}`;
  const method = "post";
  paths[fullPath] = paths[fullPath] || {};
  const op: any = {
    tags: ["VisitorInsights"],
    summary: null,
    responses: {
      '200': { description: 'Successful response' },
      '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  };
  // Build parameters (path + query)
  const params: any[] = [];
  if (params.length) op.parameters = params;
  op.requestBody = {
    required: true,
    content: { 'application/json': { schema: { $ref: '#/components/schemas/VisitorInsightCreate' } } },
  };
  paths[fullPath][method] = op;
})();
(function(){
  const base = "/visitor-insights";
  const sub = "/:id";
  const fullPath = `${base}${sub}`;
  const method = "delete";
  paths[fullPath] = paths[fullPath] || {};
  const op: any = {
    tags: ["VisitorInsights"],
    summary: null,
    responses: {
      '200': { description: 'Successful response' },
      '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  };
  // Build parameters (path + query)
  const params: any[] = [];
  params.push({ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Resource ID' });
  if (params.length) op.parameters = params;
  paths[fullPath][method] = op;
})();
(function(){
  const base = "/visitor-insights";
  const sub = "/:id";
  const fullPath = `${base}${sub}`;
  const method = "get";
  paths[fullPath] = paths[fullPath] || {};
  const op: any = {
    tags: ["VisitorInsights"],
    summary: null,
    responses: {
      '200': { description: 'Successful response' },
      '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  };
  // Build parameters (path + query)
  const params: any[] = [];
  params.push({ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Resource ID' });
  if (params.length) op.parameters = params;
  paths[fullPath][method] = op;
})();
(function(){
  const base = "/visitor-insights";
  const sub = "/:id";
  const fullPath = `${base}${sub}`;
  const method = "put";
  paths[fullPath] = paths[fullPath] || {};
  const op: any = {
    tags: ["VisitorInsights"],
    summary: null,
    responses: {
      '200': { description: 'Successful response' },
      '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  };
  // Build parameters (path + query)
  const params: any[] = [];
  params.push({ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Resource ID' });
  if (params.length) op.parameters = params;
  op.requestBody = {
    required: true,
    content: { 'application/json': { schema: { $ref: '#/components/schemas/VisitorInsightUpdate' } } },
  };
  paths[fullPath][method] = op;
})();
(function(){
  const base = "/top-products";
  const sub = "/";
  const fullPath = `${base}${sub}`;
  const method = "get";
  paths[fullPath] = paths[fullPath] || {};
  const op: any = {
    tags: ["TopProducts"],
    summary: null,
    responses: {
      '200': { description: 'Successful response' },
      '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  };
  // Build parameters (path + query)
  const params: any[] = [];
  if (params.length) op.parameters = params;
  paths[fullPath][method] = op;
})();
(function(){
  const base = "/top-products";
  const sub = "/";
  const fullPath = `${base}${sub}`;
  const method = "post";
  paths[fullPath] = paths[fullPath] || {};
  const op: any = {
    tags: ["TopProducts"],
    summary: null,
    responses: {
      '200': { description: 'Successful response' },
      '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  };
  // Build parameters (path + query)
  const params: any[] = [];
  if (params.length) op.parameters = params;
  op.requestBody = {
    required: true,
    content: { 'application/json': { schema: { $ref: '#/components/schemas/TopProductCreate' } } },
  };
  paths[fullPath][method] = op;
})();
(function(){
  const base = "/top-products";
  const sub = "/:id";
  const fullPath = `${base}${sub}`;
  const method = "delete";
  paths[fullPath] = paths[fullPath] || {};
  const op: any = {
    tags: ["TopProducts"],
    summary: null,
    responses: {
      '200': { description: 'Successful response' },
      '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  };
  // Build parameters (path + query)
  const params: any[] = [];
  params.push({ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Resource ID' });
  if (params.length) op.parameters = params;
  paths[fullPath][method] = op;
})();
(function(){
  const base = "/top-products";
  const sub = "/:id";
  const fullPath = `${base}${sub}`;
  const method = "get";
  paths[fullPath] = paths[fullPath] || {};
  const op: any = {
    tags: ["TopProducts"],
    summary: null,
    responses: {
      '200': { description: 'Successful response' },
      '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  };
  // Build parameters (path + query)
  const params: any[] = [];
  params.push({ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Resource ID' });
  if (params.length) op.parameters = params;
  paths[fullPath][method] = op;
})();
(function(){
  const base = "/top-products";
  const sub = "/:id";
  const fullPath = `${base}${sub}`;
  const method = "put";
  paths[fullPath] = paths[fullPath] || {};
  const op: any = {
    tags: ["TopProducts"],
    summary: null,
    responses: {
      '200': { description: 'Successful response' },
      '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  };
  // Build parameters (path + query)
  const params: any[] = [];
  params.push({ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Resource ID' });
  if (params.length) op.parameters = params;
  op.requestBody = {
    required: true,
    content: { 'application/json': { schema: { $ref: '#/components/schemas/TopProductUpdate' } } },
  };
  paths[fullPath][method] = op;
})();
(function(){
  const base = "/sales-maps";
  const sub = "/";
  const fullPath = `${base}${sub}`;
  const method = "get";
  paths[fullPath] = paths[fullPath] || {};
  const op: any = {
    tags: ["SalesMaps"],
    summary: null,
    responses: {
      '200': { description: 'Successful response' },
      '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  };
  // Build parameters (path + query)
  const params: any[] = [];
  if (params.length) op.parameters = params;
  paths[fullPath][method] = op;
})();
(function(){
  const base = "/sales-maps";
  const sub = "/";
  const fullPath = `${base}${sub}`;
  const method = "post";
  paths[fullPath] = paths[fullPath] || {};
  const op: any = {
    tags: ["SalesMaps"],
    summary: null,
    responses: {
      '200': { description: 'Successful response' },
      '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  };
  // Build parameters (path + query)
  const params: any[] = [];
  if (params.length) op.parameters = params;
  op.requestBody = {
    required: true,
    content: { 'application/json': { schema: { $ref: '#/components/schemas/SalesMapCreate' } } },
  };
  paths[fullPath][method] = op;
})();
(function(){
  const base = "/sales-maps";
  const sub = "/:id";
  const fullPath = `${base}${sub}`;
  const method = "delete";
  paths[fullPath] = paths[fullPath] || {};
  const op: any = {
    tags: ["SalesMaps"],
    summary: null,
    responses: {
      '200': { description: 'Successful response' },
      '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  };
  // Build parameters (path + query)
  const params: any[] = [];
  params.push({ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Resource ID' });
  if (params.length) op.parameters = params;
  paths[fullPath][method] = op;
})();
(function(){
  const base = "/sales-maps";
  const sub = "/:id";
  const fullPath = `${base}${sub}`;
  const method = "get";
  paths[fullPath] = paths[fullPath] || {};
  const op: any = {
    tags: ["SalesMaps"],
    summary: null,
    responses: {
      '200': { description: 'Successful response' },
      '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  };
  // Build parameters (path + query)
  const params: any[] = [];
  params.push({ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Resource ID' });
  if (params.length) op.parameters = params;
  paths[fullPath][method] = op;
})();
(function(){
  const base = "/sales-maps";
  const sub = "/:id";
  const fullPath = `${base}${sub}`;
  const method = "put";
  paths[fullPath] = paths[fullPath] || {};
  const op: any = {
    tags: ["SalesMaps"],
    summary: null,
    responses: {
      '200': { description: 'Successful response' },
      '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  };
  // Build parameters (path + query)
  const params: any[] = [];
  params.push({ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Resource ID' });
  if (params.length) op.parameters = params;
  op.requestBody = {
    required: true,
    content: { 'application/json': { schema: { $ref: '#/components/schemas/SalesMapUpdate' } } },
  };
  paths[fullPath][method] = op;
})();

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: "sales-dashboard-api API",
    version: '1.0.0',
    description: "A RESTful API backend for managing data powering a sales dashboard. It organizes business metrics such as KPIs, top products, visitor insights, revenue streams, satisfaction analytics, and geographic sales figures, supporting complete CRUD operations across all dataset modules for flexible dashboard integration.",
  },
  servers: [ { url: process.env.SWAGGER_SERVER_URL || '/', description: 'API server' } ],
  tags,
  components,
  // Do not apply global security to all endpoints; protected routes add `security` explicitly.
  security: [],
  paths,
};

export default swaggerSpec;
