{
	"translatorID": "ab88d517-d88c-4a73-a0ad-c94c76cca849",
	"label": "eMedicine",
	"creator": "William Smith",
	"target": "^https?://emedicine\\.medscape\\.com/article/",
	"minVersion": "1.0.0b4.r5",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "g",
	"lastUpdated": "2011-10-30 21:36:06"
}

// Emedicine.Medscape.com translator.
// Version 1.00
// By William Smith, see http://www.willsmith.org/contactme/

function detectWeb(doc, url) {
	if (doc.location.href.match("(overview|treatment|diagnosis|followup|media)")) {
		return "journalArticle";
	}
}


// Everything lives in Metas.  Very convenient.

function useMeta (doc, newItem, field, zoteroField) {
	xpath='//meta[@name="' + field + '"]/@content';
	temp=doc.evaluate(xpath, doc, null, XPathResult.ANY_TYPE, null).iterateNext();
	if(temp)
	{ 	
		newItem[zoteroField] =temp.value;     
	}
}
function getMeta (doc, newItem, field) {
	xpath='//meta[@name="' + field + '"]/@content';
	temp=doc.evaluate(xpath, doc, null, XPathResult.ANY_TYPE, null);
	return temp;
}

function scrape(doc, url) {

	var namespace = doc.documentElement.namespaceURI;
	var nsResolver = namespace ? function(prefix) {
		if (prefix == 'x') return namespace; else return null;
	} : null;	
	
	var fieldTitle;
	
	var newItem = new Zotero.Item("journalArticle");

	newItem.publication = 'Medscape - eMedicine';

	// Geta few useful fields.
	useMeta(doc, newItem, "title", "title");
	useMeta(doc, newItem, "date"        , "date" );
	useMeta(doc, newItem, "book"        , "repository");
	useMeta(doc, newItem, "description" , "abstractNote"); 
	newItem.abstractNote = newItem.abstractNote.replace(/^(Overview|Treatment|Diagnosis|Followup|Media):\s+/, "");
	
	// Authors - we only handle one.
	authors = getMeta(doc, newItem, "authors");
	Zotero.debug(authors)
	if (!String(authors).match(/[a-z]/)) {
		authors = authors.iterateNext().textContent;
		Zotero.debug('author: <'+authors+'>');
		newItem.creators.push(Zotero.Utilities.cleanAuthor(authors, "author"));
	}

	// Keywords.
	keywords = getMeta(doc, newItem, "keywords");
	if (keywords) {
		keywords = keywords.iterateNext().textContent;
		Zotero.debug('keywords: <'+keywords+'>');
		keywords = keywords.split(",");
		for (var i=0;i<keywords.length; i++) {
			Zotero.debug('keyword['+i+']: <'+keywords[i]+'>');
			newItem.tags[i] = Zotero.Utilities.cleanTags(keywords[i], "");
		}
	}
		
	newItem.url = url;

	// Attachment doesn't seem to work - misses a stylesheet or something, and looks ugly.	
	// newItem.attachments.push({url:url, title:"eMedicine Snapshot",mimeType:"text/html"});
	newItem.complete();
}

function doWeb(doc, url) {
	var namespace = doc.documentElement.namespaceURI;
	var nsResolver = namespace ? function(prefix) {
		if (prefix == 'x') return namespace; else return null;
	} : null;
	

	scrape(doc,url);
}/** BEGIN TEST CASES **/
var testCases = [
	{
		"type": "web",
		"url": "http://emedicine.medscape.com/article/163751-overview",
		"items": [
			{
				"itemType": "journalArticle",
				"creators": [],
				"notes": [],
				"tags": [
					"Brugada Syndrome information",
					" Brugada Syndrome articles"
				],
				"seeAlso": [],
				"attachments": [],
				"publication": "Medscape - eMedicine",
				"title": "Brugada Syndrome",
				"date": "2011-06-20-04:00",
				"abstractNote": "Brugada syndrome is a disorder characterized by sudden death associated with one of several electrocardiographic (ECG) patterns characterized by incomplete right bundle-branch block and ST elevations in the anterior precordial leads.",
				"url": "http://emedicine.medscape.com/article/163751-overview",
				"libraryCatalog": "eMedicine",
				"accessDate": "CURRENT_TIMESTAMP"
			}
		]
	}
]
/** END TEST CASES **/