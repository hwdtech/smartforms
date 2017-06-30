$(() => {
  let $globalConfig;
  $.get('forms/extensions/global_config.json', data => {
    $globalConfig = data;
  });

  $('.select-example').change(function () {
    $('.modal-container').hide();
    const el = $('.well form');
    const type = $(this).val();

    $.get(`forms/${type}.json`, data => {
      window.form = smartforms.createForm(el, data, $globalConfig);
    });
  }).change();

  const providerTemplate = function (provider) {
    return `<tr class="provider" data-json-path="${provider.path}">${
       provider.isInformationModal
         ? '<td class="information-modal-initial-button">'
         : provider.isReceiptModal
           ? '<td class="receipt-modal-initial-button">'
           : '<td class="modal-initial-button">'
             }<a href="#">${provider.name}</a>` +
         '</td>' +
         '<td class="modal-column">' +
           '<div class="modal"></div>' +
         '</td>' +
       '</tr>';
  };

  const $providersContainer = $('#providers tbody');

  [
    { path: 'forms/modal.json', name: 'Модальное окно' },
    { path: 'forms/registration.json', name: 'Регистрация' },
    { path: 'forms/login.json', name: 'Вход' }
  ].forEach(provider => {
    $providersContainer.append(providerTemplate(provider));
  });

  const $providersWithSchemaContainer = $('#providersWithSchema tbody');

  [
    { path: 'select_with_value_in_schema.json', name: 'Select с name и value' }
  ].forEach(provider => {
    $providersWithSchemaContainer.append(providerTemplate(provider));
  });

  $providersContainer.on('click', '.receipt-modal-initial-button a', function (e) {
    e.preventDefault();

    const $provider = $(this.closest('tr.provider'));

    $.get($provider.data('jsonPath'), data => {
      const reports = [
        '<div id="receiptwrapper"><style type="text/css"> @page { margin-left: 8px; margin-top: 22px; margin-right: 10px; @top-left-corner { 8px }; } </style><br>        <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;"><tr><td width="320" valign="top" style="font-size: 9.75pt;font-family: arial,serif;line-height:110%"><table><tr><td><span><img src="https://www-test.vseplatezhi.ru/resources/media/images/logo-bw.png" width="213.75pt;" height="37.5pt;"><br><br><span id="sys_name" style="font:9.75pt Arial;"><b>Система online-платежей «ВсеПлатежи»</b></span><br><br><span style="font:9.75pt Arial;"> НКО «Перспектива» (ООО)<br>ИНН&nbsp;5503135638, ОГРН&nbsp;1155500000017<br> Адрес:&nbsp;644033, г. Омск, ул. В.М. Шукшина, д. 9, пом. 9П<br> Тел.:&nbsp;8 800 700-08-38<br> Электронная почта:&nbsp;abon@vp.ru </span><br><span style="font:9.75pt Arial;">Сайт:&nbsp;</span><span style="font:9.75pt Arial;font-weight:bold;"><a href="http://VP.RU">vp.ru</a></span><br><br><span style="font:8.35pt Arial;">Комиссия системы:&nbsp;3.23&nbsp;руб.</span><br><span style="font:8.35pt Arial;">Уважаемый пользователь! При необходимости Вы можете получить квитанцию на бумажном носителе, распечатав ее самостоятельно в личном кабинете, или обратиться к нам, написав запрос на эл. адрес <a href="mailto:abon@vp.ru">abon@vp.ru</a>.</span><br><br><span style="font:8.35pt Arial;">По запросу пользователей других городов заверенная квитанция отправляется Почтой России.</span></span></td></tr><tr><td width="320" align="top" style="font-size: 9.75pt;font-family: arial,serif;"> <table align="right" style="width: 135pt;margin-right: 10pt;"><tr><td><div id="stamp_block" style="border: 3pt solid #000080;color: #000080;text-align: center;width: 130pt;font:7.25pt Arial;margin-top:7.5pt"> НКО «Перспектива» (ООО)<br> ИНН&nbsp;5503135638<br><b>ОПЛАЧЕНО</b><br> 07/12/2016 13:12 </div>                        </td>                      </tr>                    </table>                  </td>                </tr>              </table>            </td>            <td align="left" valign="top" style="font-size: 9.75pt;font-family: arial,serif;line-height:110%;padding-left: 22.5pt;border-left: 0.75pt solid #000000;">              <table>                <tr>                  <td>                    <div id="payment_props"><span style="font:9.75pt Arial;font-weight:bold;">Платеж №&nbsp;50000338<br> принят&nbsp;29-12-2016 04:04:02</span></div>                    <div id="company_info" style="margin-top: 9.75pt;"><span style="font:9.75pt Arial;">Прием платежа в пользу:</span><br><span style="font:9.75pt Arial;font-weight:bold;">Билайн</span><br><span style="font:9.75pt Arial;"> р/с&nbsp;40702810000311000342<br> в&nbsp;в филиале ГПБ в г. Омске<br> БИК&nbsp;045279828<br> ИНН&nbsp;5406323202 </span></div>                    <div id="payment_method" style="margin-top: 9.75pt;"><span style="font:9.75pt Arial;"> Средство оплаты:&nbsp;Банковская карта </span></div>                    <div id="payment_detail" style="margin-top: 9.75pt;"><span style="font:9.75pt Arial;"><b>Номер телефона: +7 2345234524</b><br><b>Услуга:&nbsp;${serviceName}</b><br><br></span></div>                  </td>                </tr>                <tr>                  <td><span style="font:9.75pt Arial;font-weight:bold;"> Сумма к зачислению:&nbsp;123.0&nbsp;руб. </span></td>                </tr>              </table>            </td>          </tr>        </table>      </div>',
        '<div id="receiptwrapper"><style type="text/css"> @page { margin-left: 8px; margin-top: 22px; margin-right: 10px; @top-left-corner { 8px }; } </style><br>        <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;"><tr><td width="320" valign="top" style="font-size: 9.75pt;font-family: arial,serif;line-height:110%"><table><tr><td><span><img src="https://www-test.vseplatezhi.ru/resources/media/images/logo-bw.png" width="213.75pt;" height="37.5pt;"><br><br><span id="sys_name" style="font:9.75pt Arial;"><b>Система online-платежей «ВсеПлатежи»</b></span><br><br><span style="font:9.75pt Arial;"> НКО «Перспектива» (ООО)<br>ИНН&nbsp;5503135638, ОГРН&nbsp;1155500000017<br> Адрес:&nbsp;644033, г. Омск, ул. В.М. Шукшина, д. 9, пом. 9П<br> Тел.:&nbsp;8 800 700-08-38<br> Электронная почта:&nbsp;abon@vp.ru </span><br><span style="font:9.75pt Arial;">Сайт:&nbsp;</span><span style="font:9.75pt Arial;font-weight:bold;"><a href="http://VP.RU">vp.ru</a></span><br><br><span style="font:8.35pt Arial;">Комиссия системы:&nbsp;3.23&nbsp;руб.</span><br><span style="font:8.35pt Arial;">Уважаемый пользователь! При необходимости Вы можете получить квитанцию на бумажном носителе, распечатав ее самостоятельно в личном кабинете, или обратиться к нам, написав запрос на эл. адрес <a href="mailto:abon@vp.ru">abon@vp.ru</a>.</span><br><br><span style="font:8.35pt Arial;">По запросу пользователей других городов заверенная квитанция отправляется Почтой России.</span></span></td></tr><tr><td width="320" align="top" style="font-size: 9.75pt;font-family: arial,serif;"> <table align="right" style="width: 135pt;margin-right: 10pt;"><tr><td><div id="stamp_block" style="border: 3pt solid #000080;color: #000080;text-align: center;width: 130pt;font:7.25pt Arial;margin-top:7.5pt"> НКО «Перспектива» (ООО)<br> ИНН&nbsp;5503135638<br><b>ОПЛАЧЕНО</b><br> 07/12/2016 13:12 </div>                        </td>                      </tr>                    </table>                  </td>                </tr>              </table>            </td>            <td align="left" valign="top" style="font-size: 9.75pt;font-family: arial,serif;line-height:110%;padding-left: 22.5pt;border-left: 0.75pt solid #000000;">              <table>                <tr>                  <td>                    <div id="payment_props"><span style="font:9.75pt Arial;font-weight:bold;">Платеж №&nbsp;50000338<br> принят&nbsp;29-12-2016 04:04:02</span></div>                    <div id="company_info" style="margin-top: 9.75pt;"><span style="font:9.75pt Arial;">Прием платежа в пользу:</span><br><span style="font:9.75pt Arial;font-weight:bold;">Билайн</span><br><span style="font:9.75pt Arial;"> р/с&nbsp;40702810000311000342<br> в&nbsp;в филиале ГПБ в г. Омске<br> БИК&nbsp;045279828<br> ИНН&nbsp;5406323202 </span></div>                    <div id="payment_method" style="margin-top: 9.75pt;"><span style="font:9.75pt Arial;"> Средство оплаты:&nbsp;Банковская карта </span></div>                    <div id="payment_detail" style="margin-top: 9.75pt;"><span style="font:9.75pt Arial;"><b>Номер телефона: +7 2345234524</b><br><b>Услуга:&nbsp;${serviceName}</b><br><br></span></div>                  </td>                </tr>                <tr>                  <td><span style="font:9.75pt Arial;font-weight:bold;"> Сумма к зачислению:&nbsp;123.0&nbsp;руб. </span></td>                </tr>              </table>            </td>          </tr>        </table>      </div>'
      ];
      const readyForm = combiner.getReceiptForm(reports, 'https://vp.ru/');
      window.modal = smartforms.createReceiptModal($provider.find('.modal-column .modal'), readyForm);
      $provider.find('.modal-column .modal').modal('show');
    });
  });

  $providersContainer.on('click', '.information-modal-initial-button a', function (e) {
    e.preventDefault();

    const $provider = $(this.closest('tr.provider'));

    $.get($provider.data('jsonPath'), data => {
      window.modal = smartforms.createSuccessPaymentModal($provider.find('.modal-column .modal'), data);
      $provider.find('.modal-column .modal').modal('show');
    });
  });

  $providersContainer.on('click', '.modal-initial-button a', function (e) {
    e.preventDefault();

    const $provider = $(this.closest('tr.provider'));

    $.get($provider.data('jsonPath'), data => {
      window.modal = smartforms.createModal($provider.find('.modal-column .modal'), data, $globalConfig);
      $provider.find('.modal-column .modal').modal('show');
    });
  });

  $providersWithSchemaContainer.on('click', '.modal-initial-button a', function (e) {
    e.preventDefault();

    const $provider = $(this.closest('tr.provider'));
    const $providerPath = $provider.data('jsonPath');

    $.get('forms/' + $providerPath, data => {
      $.get('forms/schemas/' + $providerPath, providerSchema => {

        var readyForm = combiner.getForm(providerSchema, data, $globalConfig);
        window.modal = smartforms.createModal($provider.find('.modal-column .modal'), readyForm, $globalConfig);
        $provider.find('.modal-column .modal').modal('show');
        window.modal.on('afterSubmit', function(e, isValid, form) {
          console.log('Заполненная форма');
          console.log(form);
          combiner.getSchema(providerSchema, form);
        });
      });
    });
  });
});
