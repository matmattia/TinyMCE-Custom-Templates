/**
 * TinyMCE Custom Templates
 * @name bootstrap-lightbox.js
 * @author Mattia - https://www.matriz.it
 * @version 1.0.0
 * @date September 3, 2026
 * @copyright (c) 2026 Mattia at Matriz.it (info@matriz.it)
 * @license MIT - https://opensource.org/license/mit
 * @example Visit https://www.matriz.it/projects/tinymce-custom-templates/ for more informations
 */
tinymce.PluginManager.add('customtemplates', (editor, url) => {
	editor.ui.registry.addMenuItem('customtemplates_menu', {
		text: 'Template',
		onAction: function() {
			var templates = editor.getParam('custom_templates', []), select_options = [],  i = 0;
			for (i = 0; i < templates.length; i++) {
				select_options.push({
					text: templates[i].title,
					value: i.toString()
				});
			}
			editor.windowManager.open({
				title: 'Inserisci Template',
				body: {
					type: 'panel',
					items: [
						{
							type: 'selectbox',
							name: 'selectedTemplate',
							label: 'Seleziona un template',
							items: select_options
						}
					]
				},
				buttons: [
					{
						type: 'cancel',
						text: 'Cancel'
					},
					{
						type: 'submit',
						text: 'Insert',
						primary: true
					}
				],
				onSubmit: (api) => {
					const data = api.getData();
					const i = data.selectedTemplate;
					if (templates[i]) {
						if ('content' in templates[i] && typeof templates[i].content == 'string') {
							editor.insertContent(templates[i].content);
						} else if ('url' in templates[i] && typeof templates[i].url == 'string' && templates[i].url) {
							editor.setProgressState(true);
							fetch(templates[i].url).then(function(res) {
								if (!res.ok) {
									throw new Error('La richiesta non è andata a buon fine.');
								}
								return res.text();
							}).then(function(t) {
								editor.insertContent(t);
							}).catch(function() {
								editor.notificationManager.open({
									text: 'Si è verificato un errore durante la selezione del template.',
									type: 'error'
								});
							}).finally(function() {
								editor.setProgressState(false);
							});
						}
					}
					api.close();
				}
			});
		}
	});
  
	return {
		getMetadata: () => ({
			name: 'Custom Templates',
			url: 'https://www.matriz.it/projects/tinymce-custom-templates/'
		})
	};
});