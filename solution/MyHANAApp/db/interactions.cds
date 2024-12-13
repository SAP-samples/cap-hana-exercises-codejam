//namespace app.interactions;

using {
    Country,
    Currency,
    cuid,
    managed
} from '@sap/cds/common';

context app.interactions {
    type BusinessKey : String(10);
    type Price       : Decimal(10, 2);
    type Text        : String(1024);

    entity Headers : cuid, managed {
        items   : Composition of many Items
                      on items.interaction = $self;
        partner : BusinessKey;
        country : Country;
    };

    entity Items : cuid {
        interaction : Association to Headers;
        text        : localized Text;
        date        : DateTime;

        @Semantics.amount.currencyCode: 'currency'
        price       : Price;
        currency    : Currency;
    };
}

@cds.persistence.exists 
@cds.persistence.calcview 
Entity V_INTERACTION {
key     CREATEDAT: Timestamp  @title: 'CREATEDAT: CREATEDAT' ; 
        CREATEDBY: String(255)  @title: 'CREATEDBY: CREATEDBY' ; 
        MODIFIEDAT: Timestamp  @title: 'MODIFIEDAT: MODIFIEDAT' ; 
        MODIFIEDBY: String(255)  @title: 'MODIFIEDBY: MODIFIEDBY' ; 
        PARTNER: String(10)  @title: 'PARTNER: PARTNER' ; 
        COUNTRY_CODE: String(3)  @title: 'COUNTRY_CODE: COUNTRY_CODE' ; 
        TEXT: String(1024)  @title: 'TEXT: TEXT' ; 
        DATE: String  @title: 'DATE: DATE' ; 
        PRICE: Decimal(10)  @title: 'PRICE: PRICE' ; 
        CURRENCY_CODE: String(3)  @title: 'CURRENCY_CODE: CURRENCY_CODE' ; 
}