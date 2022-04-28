using app.interactions from '../db/interactions';
@requires: 'authenticated-user'
service CatalogService {

 entity Interactions_Header
	as projection on interactions.Interactions_Header;

 entity Interactions_Items
	as projection on  interactions.Interactions_Items;

}