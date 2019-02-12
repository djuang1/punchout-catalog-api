var formUrl = "/api/cxml";
var VARIABLES_HELP = {"FromDomain":"Specifies the domain of the FromIdentity parameter.  This is typically set to \"NetworkId\". <br>XPath: <code>From\/Credential[domain]<\/code>","FromIdentity":"The From credential identifies the originator of the request (the buying organization).  <br>XPath:<br><code>From\/Credential\/Identity<\/code>","ToDomain":"Specifies the domain of the ToIdentity parameter.  This is typically set to \"DUNS\".  <br>XPath: <code>To\/Credential[domain]<\/code>","ToIdentity":"The To credential identifies the supplier.  Typically this is the suppliers DUNS.  <br>XPath: <code>To\/Credential\/Identity<\/code>","SenderDomain":"Specifies the domain of the SenderIdentity parameter.  This is typically set to \"NetworkId\".  <br>XPath: <code>Sender\/Credential[domain]<\/code>","SenderIdentity":"The Sender credential identifies the buying organization.  This is sometimes referred to as the username.  <br>XPath:<br><code>Sender\/Credential\/Identity<\/code>","SharedSecret":"The shared secret is used to validate the credentials.  This is sometimes referred to as the password.  <br>XPath:<br><code>Sender\/Credential\/SharedSecret<\/code>","BuyerCookie":"BuyerCookie enables the procurement application to associate a given PunchOutOrderMessage with its originating PunchOutSetupRequest. Therefore, the supplier's website should return this element whenever it appears. Do not use the BuyerCookie to track PunchOut sessions, because it changes for every session, from create, to inspect, to edit."};
var ENTITY_MAP = {"&": "&amp;", "<": "&lt;", ">": "&gt;",	'"': '&quot;', "'": '&#39;'};

function escapeHtml(string) {
	return String(string).replace(/[&<>"']/g, function (s) {
		return ENTITY_MAP[s];
	});
}

function init() {
	updateURL();
	updateXML();
	createTooltips();
	updateTooltipTitles();
}

function onFormSubmit() {
	updateXML();
	updateURL($('#url').val());
	var encodeMethod = $('#encodeMethod').val();
	if(encodeMethod == 'base64') {
		var xml = $('#cxmlUrlencoded').val();
		var b64xml = base64_encode(xml);
		$('#cxmlUrlencoded').attr('name', 'cXML-base64');
		$('#cxmlUrlencoded').attr('value', 'b64xml');
		window.setTimeout(function() { $('#cxmlUrlencoded').attr('name', 'cXML-urlencoded'); }, 500);
	}
	else if(encodeMethod == 'url') {

	}
	else if(encodeMethod == 'raw') {
		$('#punchout_form').attr('action', formUrl);
		var hiddenField = document.createElement("input");
		hiddenField.type = 'hidden';
		hiddenField.name = 'url';
		hiddenField.value = $('#url').val();
		$('#punchout_form').append(hiddenField);
	}
	return true;
}

function createXML() {
	var xml = $('#cxml').val();
	var i = 0, e;
	while((e = $('#name' + i)) && e.length > 0) {
		if($('#name' + i).val() != '') {
			var enc = escapeHtml($('#value' + i).val());
			xml = xml.replace('@' + $('#name' + i).val() + '@', enc);
			xml = xml.replace('@' + $('#name' + i).val() + '@', enc);
		}
		i++;
	}
	return xml;
}

function updateXML() {
	var xml = createXML();
	$('#outputXml').text(xml);
	$('#cxmlUrlencoded').val(xml);
}

function updateURL(url) {
	if(url == undefined) {
		url = '';
		$('#url').val(url);
	}
	$('#punchout_form').attr('action', url);
	var i = 0, e;
	while((e = $('#name' + i)) && e.length > 0) {
		if($('#name' + i).val() == 'SupplierSetupURL') {
			$('#value' + i).val(url);
		}
		i++;
	}
}

function toggleView(view) {
	var doc = $('#doc'), b = 'basic-view', a = 'advanced-view';
	if(view == 1) {
		doc.removeClass(b).addClass(a);
	}
	else {
		doc.addClass(b).removeClass(a);
	}
}

function createTooltips() {
	$(function() {
		$('#variablesTable [data-toggle="tooltip"]').tooltip();
	})
}

function updateTooltipTitles() {
	var i = 0, e;
	while((e = $('#name' + i)) && e.length > 0) {
		var msg = VARIABLES_HELP[$(e).val()] || 'not available'
		$('#help' + i).attr('title', msg).attr('data-original-title', msg).tooltip('fixTitle');
		i++;
	}
}
