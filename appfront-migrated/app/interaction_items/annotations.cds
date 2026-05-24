using CatalogService as service from '../../srv/interaction_srv';

// ── Field-level labels and text annotations ───────────────────────────────────

annotate service.Interactions_Header with {
    partner @(
        Common.Label    : 'Partner',
        Common.ValueList: {
            Label         : 'Partners',
            CollectionPath: 'Interactions_Header',
            Parameters    : [
                {
                    $Type            : 'Common.ValueListParameterOut',
                    LocalDataProperty: partner,
                    ValueListProperty: 'partner',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'country_code',
                }
            ]
        }
    );
    country @(
        Common.Label          : 'Country',
        Common.Text           : country.descr,
        Common.TextArrangement: #TextOnly,
    );
};

annotate service.Interactions_Items with {
    text        @Common.Label: 'Text';
    date        @Common.Label: 'Date';
    price       @Common.Label: 'Price';
    currency    @Common.Label: 'Currency';
};

// ── Interactions_Header ───────────────────────────────────────────────────────

annotate service.Interactions_Header with @(
UI.HeaderInfo         : {
    Title         : {
        $Type: 'UI.DataField',
        Value: partner,
    },
    TypeName      : 'Incident',
    TypeNamePlural: 'Incidents',
    Description   : {Value: country.descr},
    TypeImageUrl  : 'sap-icon://customer',
},
UI.SelectionFields    : [partner, country_code],
UI.PresentationVariant: {
    SortOrder     : [{
        $Type     : 'Common.SortOrderType',
        Property  : partner,
        Descending: false,
    }],
    Visualizations: ['@UI.LineItem'],
},
UI.FieldGroup #GeneratedGroup: {
    $Type: 'UI.FieldGroupType',
    Label: 'Partner Details',
    Data : [
        {
            $Type: 'UI.DataField',
            Value: partner,
        },
        {
            $Type                  : 'UI.DataField',
            ![@Common.FieldControl]: #ReadOnly,
            Value                  : country.descr,
        },
    ]
},
UI.FieldGroup #Admin  : {
    $Type: 'UI.FieldGroupType',
    Label: 'Change Information',
    Data : [
        {
            $Type: 'UI.DataField',
            Value: createdBy
        },
        {
            $Type: 'UI.DataField',
            Value: modifiedBy
        },
        {
            $Type: 'UI.DataField',
            Value: createdAt
        },
        {
            $Type: 'UI.DataField',
            Value: modifiedAt
        }
    ]
},
UI.Facets             : [
    {
        $Type : 'UI.ReferenceFacet',
        ID    : 'GeneratedFacet1',
        Label : 'General Information',
        Target: '@UI.FieldGroup#GeneratedGroup',
    },
    {
        $Type : 'UI.ReferenceFacet',
        Label : 'Interaction Items',
        Target: 'items/@UI.LineItem',
    },
    {
        $Type : 'UI.ReferenceFacet',
        Label : 'Administration',
        Target: '@UI.FieldGroup#Admin',
    }
],
UI.LineItem           : [
    {
        $Type     : 'UI.DataField',
        Value     : partner,
        Importance: #High,
    },
    {
        $Type                  : 'UI.DataField',
        ![@Common.FieldControl]: #ReadOnly,
        Value                  : country.descr,
        Importance             : #Medium,
    },
]
);

// ── Interactions_Items ────────────────────────────────────────────────────────

annotate service.Interactions_Items with @(
UI.HeaderInfo         : {
    Title         : {
        $Type: 'UI.DataField',
        Value: text,
    },
    TypeName      : 'Interaction Item',
    TypeNamePlural: 'Interaction Items',
    TypeImageUrl  : 'sap-icon://activity-items',
},
UI.DataPoint #Price   : {
    Value      : price,
    Title      : 'Price',
    ValueFormat: {
        $Type                   : 'UI.NumberFormat',
        NumberOfFractionalDigits: 2,
    },
},
UI.FieldGroup #GeneratedGroup: {
    $Type: 'UI.FieldGroupType',
    Label: 'Item Details',
    Data : [
        {
            $Type: 'UI.DataField',
            Value: text,
        },
        {
            $Type: 'UI.DataField',
            Value: date,
        },
        {
            $Type : 'UI.DataFieldForAnnotation',
            Target: '@UI.DataPoint#Price',
        },
    ]
},
UI.Facets             : [
    {
        $Type : 'UI.ReferenceFacet',
        ID    : 'GeneratedFacet1',
        Label : 'General Information',
        Target: '@UI.FieldGroup#GeneratedGroup',
    },
    {
        $Type : 'UI.ReferenceFacet',
        Label : 'Item Translations',
        Target: 'texts/@UI.LineItem'
    }
],
UI.LineItem           : [
    {
        $Type     : 'UI.DataField',
        Value     : text,
        Importance: #High,
    },
    {
        $Type     : 'UI.DataField',
        Value     : date,
        Importance: #Medium,
    },
    {
        $Type     : 'UI.DataFieldForAnnotation',
        Target    : '@UI.DataPoint#Price',
        Importance: #High,
    },
]
);

// ── Interactions_Items.texts ──────────────────────────────────────────────────

annotate service.Interactions_Items.texts with @(
UI.LineItem: [
    {
        $Type: 'UI.DataField',
        Value: locale,
        Label: 'Locale'
    },
    {
        $Type: 'UI.DataField',
        Value: text,
        Label: 'Text'
    }
]
);

annotate service.Interactions_Items.texts with {
ID @UI.Hidden;
};

annotate service.Interactions_Items.texts {
locale @(
    ValueList.entity: 'Languages',
    Common.ValueListWithFixedValues,
)
}
