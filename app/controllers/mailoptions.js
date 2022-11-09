
const htmlToTxt = (html) => {
   return html.replace(/<[^>]+>/g, '') // strips string from HTML tags
}


const szparowanie_free = (req, res) => {
    const outputForSzp = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Email: ${
        req.body.user_email
    } <a href="mailto:${
        req.body.user_email
    }?subject=Szparowanie.pl - Wiadmość dotycząca zlecenia"><button>Odpowiedz</button></a></li>
    </ul>
    <h3>Message</h3>
    <p>${
        req.body.order_description
    }</p>
    `;
    return {
        from: `"szparowanie.pl" <${
            process.env.MAILER_EMAIL
        }>`,
        to: process.env.MAIL_TO,
        subject: `DARMOWE ZDJĘCIE - ${
            req.body.user_email
        }`,
        text: 'Hello world?',
        html: outputForSzp 
    }

};
const szparowanie_NewOrder = (req, res) => {
    const outputForSzp = `
    <html>
    <head>
	<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;300;600;900&display=swap" rel="stylesheet">
	<title>Nowe zlecenie nr:${res.locals.order_id} od ${req.body.user_email}</title>
    </head>
    <body
	style="background: #fff; font-family: 'Inter', sans-serif; font-size: 16px; margin-top:0; margin-bottom:0; padding-top:0; padding-bottom:0;">
	<table align="center" cellpadding="0" cellspacing="0" style="border: 0; background: #fff; width: 500px !important;">
		<tbody>
			<tr>
				<td style="background-color: #E4E3E1; padding: 8px">
                <img src="http://szparowanie.nazwa.pl/img/szparowanie_pl.png" alt="&#9986" title='logo of szparowanie.pl' width="20px" height="20px" style="vertical-align: baseline;">
					<a style="vertical-align: top; color:black; text-decoration: none; font-weight: 600; display:inline-block; line-height: 16px; font-size: 16px;" href="http://szparowanie.pl/" target="_blank" title="szparowanie.pl" style="display: block;">
						szparowanie.pl</a>
				</td>
				<tr><td style="font-size: 12px; text-align: right; padding: 0 16px; background-color:#E4E3E1;">nr. zlecenia ${res.locals.order_id}</td></tr>
			</tr>
			<tr>
				<td colspan="1" style="background-color: #E4E3E1; padding: 16px 48px 0; font-size: 16px !important;">
                <img style="vertical-align: baseline; padding:0 20px 0 24px; color: green; font-size: 38px;" src="http://szparowanie.nazwa.pl/img/new_order.png" alt="click" height="84px" width="72px">
					<h1 style="line-height: 28px !important; display:inline-block; font-size: 24px;">Pojawiło się<br/>
                        nowe zlecenie<br/>
                        o numerze ${res.locals.order_id}
					</h1>
				</td> 
			</tr>
            <tr>
            <td colspan="2" style="background-color: #E4E3E1; padding: 24px 48px 14px; font-size: 16px !important;">
                <a  style="display: block; width: 100%; line-height: 48px; text-align: center; font-weight: 600; color:#fff;text-decoration: underline; background-color: #3F3F3F;" href="${process.env.ABSOLUTE_PATH}/adminCPanel/orders/${res.locals.order_ref}">przejdź do zlecenia</a>
            </td>
        </tr>
        <tr>
            <td colspan="2" style="background-color: #E4E3E1; padding: 14px 48px; font-size: 16px !important;">
                <a  style="display: block; width: 100%; line-height: 48px; text-align: center; font-weight: 600; color:#fff;text-decoration: underline; background-color: #8F8F8F;" href="mailto:${req.body.user_email}?subject=Szparowanie.pl - Widamość dotycząca zlecenia - ${res.locals.order_id}">wyślij wiadomość</a>
            </td>
        </tr>
			<tr>
				<td colspan="2" style="background-color: #E4E3E1; padding: 24px 48px 48px; font-size: 16px !important;">
					<h3 style="font-size:16px; font-weight: 600; margin: 0; padding: 8px 0 0 !important;">ilość plików: <span style="font-size:16px; font-weight: 300;">${Object.keys(req.files).length}</span></h3>
					<h3 style="font-size:16px; font-weight: 600; margin: 0; padding: 8px 0 0 !important;">typ transferu plików: <span style="font-size:16px; font-weight: 300;">${req.body.transfer_type != undefined ? req.body.transfer_type : ""}</span></h3>
					${req.body.line1 != undefined ? '<h3 style="font-size:16px; font-weight: 600; margin: 0; padding: 8px 0 0 !important;"><span style="font-size:16px; font-weight: 300;">' + req.body.line1 + '</span></h3>' : ""}
					${req.body.line2 != undefined ? '<h3 style="font-size:16px; font-weight: 600; margin: 0; padding: 8px 0 0 !important;">login: <span style="font-size:16px; font-weight: 300;">' + req.body.line2 + '</span></h3>' : ""}
					${req.body.line3 != undefined ? '<h3 style="font-size:16px; font-weight: 600; margin: 0; padding: 8px 0 0 !important;">hasło: <span style="font-size:16px; font-weight: 300;">' + req.body.line3 + '</span></h3>' : ""}
					${req.body.line4 != undefined ? '<h3 style="font-size:16px; font-weight: 600; margin: 0; padding: 8px 0 0 !important;">dodatkowe informacje: <span style="font-size:16px; font-weight: 300;">' + req.body.line4 + '</span></h3>' : ""}

					<h3 style="font-size:16px; font-weight: 600; margin: 0; padding: 8px 0 0 !important;">opis:</h3>
					<p style="font-size:16px; font-weight: 300; margin: 0; padding: 4px 0 0 !important;">${req.body.order_description}</p>
					<h3 style="font-size:16px; font-weight: 600; margin: 0; padding: 8px 0 0 !important;">wyjściowy format plików: <span style="font-size:16px; font-weight: 300;">${req.body.output_file_format != undefined ? req.body.output_file_format : "nie podano"}</span></h3>
					<h3 style="font-size:16px; font-weight: 600; margin: 0; padding: 8px 0 0 !important;">sposób wycinania: <span style="font-size:16px; font-weight: 300;">${req.body.clipping_options != undefined ? req.body.clipping_options : "nie podano"}</span></h3>
					<h3 style="font-size:16px; font-weight: 600; margin: 0; padding: 8px 0 0 !important;">dodatkowe opcje:</h3>
					<p style="font-size:16px; font-weight: 300; margin: 0; padding: 4px 0 0 !important;">${req.body.additional_options_retouch == "1" ? "• retusz<br/>"  : ""}
                    ${req.body.additional_options_light_color == "1" ? "• poprawa koloru / kontrastu<br/>"  : ""}
                    ${req.body.additional_options_crop == "1" ? "• kadrowanie<br/>"  : ""}
                    ${req.body.additional_options_shadow == "1" ? "• dodanie cienia<br/>"  : ""}</p>
				
				</td>
			</tr>
			<tr>
				<td colspan="2">
					<table style="background-color:#474747; padding: 32px 0;" border="0" cellpadding="0" cellspacing="0">
						<tr>
							<td style="width:20%;">
							</td>
							<td valign="bottom" style="width: 60%;">
								<div
									style="text-align: center; width: 395px; color: #999; height: 76px !important; padding-top: 5px; font-size: 10px !important; font-family: Arial, Verdana;">
									© Copyright szparowanie•pl. All rights reserved. <br />
									Nie chce dostawać wiadomości email <a style="color: #999999; text-decoration:none;" href="${process.env.ABSOLUTE_PATH}/unsubscribe/${req.body.user_email}"
										target="_blank">| UNSUBSCRIBE |</a><br /><br />
									<a style="font-size: 12px; color: #fff; font-weight: 600;"
										href="https://szparowanie.pl" target="_blank">szparowanie.pl</a> <br />
									<a style="font-size: 12px; color: #fff; font-weight: 600;"
										href="http://clipping-online.com" target="_blank">clipping-online.com</a>
								</div>
							</td>
							<td style="width:20%;">
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</tbody>
	</table>
</body>
</html>
    `;
    return {
        from: `"szparowanie.pl" <${
            process.env.MAILER_EMAIL
        }>`,
        to: process.env.MAIL_TO,
        subject: `Nowe zlecenie nr:${res.locals.order_id} od ${req.body.user_email}`,
        text: htmlToTxt(outputForSzp),
        html: outputForSzp 
    }


};
const szparowanie_decline = (req, res) => {

    const outputForSzp = `
    <html>
    <head>
	<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;300;600;900&display=swap" rel="stylesheet">
	<title>Zlecenie nr:${res.locals.order_id} - ODRZUCONE</title>
    </head>
    <body
	style="background: #fff; font-family: 'Inter', sans-serif; font-size: 16px; margin-top:0; margin-bottom:0; padding-top:0; padding-bottom:0;">
	<table align="center" cellpadding="0" cellspacing="0" style="border: 0; background: #fff; width: 500px !important;">
		<tbody>
			<tr>
				<td style="background-color: #E4E3E1; padding: 8px">
                <img src="http://szparowanie.nazwa.pl/img/szparowanie_pl.png" alt="&#9986" title='logo of szparowanie.pl' width="20px" height="20px" style="vertical-align: baseline;">
					<a style="vertical-align: top; color:black; text-decoration: none; font-weight: 600; display:inline-block; line-height: 16px; font-size: 16px;" href="http://szparowanie.pl/" target="_blank" title="szparowanie.pl" style="display: block;">
						szparowanie.pl</a>
				</td>
				<tr><td style="font-size: 12px; text-align: right; padding: 0 16px; background-color:#E4E3E1;">nr. zlecenia ${res.locals.order_id}</td></tr>
			</tr>
			<tr>
				<td colspan="1" style="background-color: #E4E3E1; padding: 16px 48px 0; font-size: 16px !important;">
                <img style="vertical-align: baseline; padding:0 20px 0 24px; color: green; font-size: 38px;" src="http://szparowanie.nazwa.pl/img/order_cancel.png" alt="click" height="84px" width="72px">
					<h1 style="line-height: 28px !important; display:inline-block; font-size: 24px;">Niestety, klient<br/>
                        <span style="color:#972C14;">ODRZUCIŁ zlecenie</span><br/>
                        o numerze ${res.locals.order_id}.
                        </h1>
				</td> 
			</tr>
            <tr>
            <td colspan="2" style="background-color: #E4E3E1; padding: 24px 48px 14px; font-size: 16px !important;">
                <a  style="display: block; width: 100%; line-height: 48px; text-align: center; font-weight: 600; color:#fff;text-decoration: underline; background-color: #3F3F3F;" href="${process.env.ABSOLUTE_PATH}/adminCPanel/orders/${res.locals.order_ref}">przejdź do zlecenia</a>
            </td>
        </tr>
        <tr>
            <td colspan="2" style="background-color: #E4E3E1; padding: 14px 48px; font-size: 16px !important;">
                <a  style="display: block; width: 100%; line-height: 48px; text-align: center; font-weight: 600; color:#fff;text-decoration: underline; background-color: #8F8F8F;" href="mailto:${req.body.user_email}?subject=Szparowanie.pl - Widamość dotycząca zlecenia - ${res.locals.order_id}">wyślij wiadomość</a>
            </td>
        </tr>
			<tr>
				<td colspan="2">
					<table style="background-color:#474747; padding: 32px 0;" border="0" cellpadding="0" cellspacing="0">
						<tr>
							<td style="width:20%;">
							</td>
							<td valign="bottom" style="width: 60%;">
								<div
									style="text-align: center; width: 395px; color: #999; height: 76px !important; padding-top: 5px; font-size: 10px !important; font-family: Arial, Verdana;">
									© Copyright szparowanie•pl. All rights reserved. <br />
									Nie chce dostawać wiadomości email <a style="color: #999999; text-decoration:none;" href="${process.env.ABSOLUTE_PATH}/unsubscribe/${req.body.user_email}"
										target="_blank">| UNSUBSCRIBE |</a><br /><br />
									<a style="font-size: 12px; color: #fff; font-weight: 600;"
										href="https://szparowanie.pl" target="_blank">szparowanie.pl</a> <br />
									<a style="font-size: 12px; color: #fff; font-weight: 600;"
										href="http://clipping-online.com" target="_blank">clipping-online.com</a>
								</div>
							</td>
							<td style="width:20%;">
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</tbody>
	</table>
</body>
</html>
    `;
    return {
        from: `"szparowanie.pl" <${
            process.env.MAILER_EMAIL
        }>`,
        to: process.env.MAIL_TO,
        subject: `Zlecenie nr:${res.locals.order_id} - ODRZUCONE`,
        text: htmlToTxt(outputForSzp),
        html: outputForSzp 
    }


};
const szparowanie_message = (req, res) => {

    const outputForSzp = `
    <html>
    <head>
	<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;300;600;900&display=swap" rel="stylesheet">
	<title>Nowa wiadomość ze strony szparowanie.pl od ${req.body.user_email}</title>
    </head>
    <body
	style="background: #fff; font-family: 'Inter', sans-serif; font-size: 16px; margin-top:0; margin-bottom:0; padding-top:0; padding-bottom:0;">
	<table align="center" cellpadding="0" cellspacing="0" style="border: 0; background: #fff; width: 500px !important;">
		<tbody>
			<tr>
				<td style="background-color: #E4E3E1; padding: 8px">
                <img src="http://szparowanie.nazwa.pl/img/szparowanie_pl.png" alt="&#9986" title='logo of szparowanie.pl' width="20px" height="20px" style="vertical-align: baseline;">
					<a style="vertical-align: top; color:black; text-decoration: none; font-weight: 600; display:inline-block; line-height: 16px; font-size: 16px;" href="http://szparowanie.pl/" target="_blank" title="szparowanie.pl" style="display: block;">
						szparowanie.pl</a>
				</td>
			<tr>
				<td colspan="1" style="background-color: #E4E3E1; padding: 16px 48px 0; font-size: 16px !important;">
                <img style="vertical-align: baseline; padding:0 20px 0 24px; color: green; font-size: 38px;" src="http://szparowanie.nazwa.pl/img/new_message.png" alt="click" height="84px" width="84px">
					<h1 style="line-height: 28px !important; display:inline-block; font-size: 24px;">Masz nową wiadomość<br/>
                        wysłaną ze strony<br/>
                        od ${req.body.user_email}
					</h1>
				</td> 
			</tr>
        <tr>
            <td colspan="2" style="background-color: #E4E3E1; padding: 14px 48px; font-size: 16px !important;">
                <a  style="display: block; width: 100%; line-height: 48px; text-align: center; font-weight: 600; color:#fff;text-decoration: underline; background-color: #3F3F3F;" href="mailto:${req.body.user_email}?subject=Szparowanie.pl - odpowiedź na wiadomość.">odpisz na wiadomość</a>
            </td>
        </tr>
			<tr>
				<td colspan="2" style="background-color: #E4E3E1; padding: 24px 48px 48px; font-size: 16px !important;">
					${req.body.name_surname != undefined ? '<h3 style="font-size:16px; font-weight: 600; margin: 0; padding: 8px 0 0 !important;">nazwa: <span style="font-size:16px; font-weight: 300;">' + req.body.name_surname + '</span></h3>' : ""}
					${req.body.user_email != undefined ? '<h3 style="font-size:16px; font-weight: 600; margin: 0; padding: 8px 0 0 !important;">email: <span style="font-size:16px; font-weight: 300;">' + req.body.user_email + '</span></h3>' : ""}
					${req.body.user_phone != undefined ? '<h3 style="font-size:16px; font-weight: 600; margin: 0; padding: 8px 0 0 !important;">telefon: <span style="font-size:16px; font-weight: 300;">' + req.body.user_phone + '</span></h3>' : ""}
					<h3 style="font-size:16px; font-weight: 600; margin: 0; padding: 8px 0 0 !important;">treść wiadomości:</h3>
					<p style="font-size:16px; font-weight: 300; margin: 0; padding: 4px 0 0 !important;">${req.body.order_description}</p>				
				</td>
			</tr>
			<tr>
				<td colspan="2">
					<table style="background-color:#474747; padding: 32px 0;" border="0" cellpadding="0" cellspacing="0">
						<tr>
							<td style="width:20%;">
							</td>
							<td valign="bottom" style="width: 60%;">
								<div
									style="text-align: center; width: 395px; color: #999; height: 76px !important; padding-top: 5px; font-size: 10px !important; font-family: Arial, Verdana;">
									© Copyright szparowanie•pl. All rights reserved. <br />
									Nie chce dostawać wiadomości email <a style="color: #999999; text-decoration:none;" href="${process.env.ABSOLUTE_PATH}/unsubscribe/${req.body.user_email}"
										target="_blank">| UNSUBSCRIBE |</a><br /><br />
									<a style="font-size: 12px; color: #fff; font-weight: 600;"
										href="https://szparowanie.pl" target="_blank">szparowanie.pl</a> <br />
									<a style="font-size: 12px; color: #fff; font-weight: 600;"
										href="http://clipping-online.com" target="_blank">clipping-online.com</a>
								</div>
							</td>
							<td style="width:20%;">
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</tbody>
	</table>
</body>
</html>
    `;
    return {
        from: `"szparowanie.pl" <${
            process.env.MAILER_EMAIL
        }>`,
        to: process.env.MAIL_TO,
        subject: `Nowa wiadomość ze strony szparowanie.pl od ${req.body.user_email}`,
        text: htmlToTxt(outputForSzp),
        html: outputForSzp 
    }


};
const szparowanie_confirmed_pdf = (req, res) => {

    const outputForSzp = `
    <html>
    <head>
	<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;300;600;900&display=swap" rel="stylesheet">
	<title>Zlecenie nr:${req.body.order_id} - PDF Z POTWIERDZENIEM</title>
    </head>
    <body
	style="background: #fff; font-family: 'Inter', sans-serif; font-size: 16px; margin-top:0; margin-bottom:0; padding-top:0; padding-bottom:0;">
	<table align="center" cellpadding="0" cellspacing="0" style="border: 0; background: #fff; width: 500px !important;">
		<tbody>
			<tr>
				<td style="background-color: #E4E3E1; padding: 8px">
                <img src="http://szparowanie.nazwa.pl/img/szparowanie_pl.png" alt="&#9986" title='logo of szparowanie.pl' width="20px" height="20px" style="vertical-align: baseline;">
					<a style="vertical-align: top; color:black; text-decoration: none; font-weight: 600; display:inline-block; line-height: 16px; font-size: 16px;" href="http://szparowanie.pl/" target="_blank" title="szparowanie.pl" style="display: block;">
						szparowanie.pl</a>
				</td>
				<tr><td style="font-size: 12px; text-align: right; padding: 0 16px; background-color:#E4E3E1;">nr. zlecenia ${req.body.order_id}</td></tr>
			</tr>
			<tr>
				<td colspan="1" style="background-color: #E4E3E1; padding: 16px 48px 0; font-size: 16px !important;">
                <img style="vertical-align: baseline; padding:0 20px 0 24px; color: green; font-size: 38px;" src="http://szparowanie.nazwa.pl/img/new_order.png" alt="click" height="84px" width="72px">
					<h1 style="line-height: 28px !important; display:inline-block; font-size: 24px;">Klient przesłał<br/>
                        potwierdzenie zapłaty<br/>
					</h1>
				</td> 
			</tr>
            <tr>
            <td colspan="2" style="background-color: #E4E3E1; padding: 24px 48px 14px; font-size: 16px !important;">
                <a  style="display: block; width: 100%; line-height: 48px; text-align: center; font-weight: 600; color:#fff;text-decoration: underline; background-color: #3F3F3F;" href="${process.env.ABSOLUTE_PATH}/adminCPanel/orders/${req.body.order_ref}">przejdź do zlecenia</a>
            </td>
        </tr>
        <tr>
            <td colspan="2" style="background-color: #E4E3E1; padding: 14px 48px; font-size: 16px !important;">
                <a  style="display: block; width: 100%; line-height: 48px; text-align: center; font-weight: 600; color:#fff;text-decoration: underline; background-color: #8F8F8F;" href="mailto:${req.body.user_email}?subject=Szparowanie.pl - Widamość dotycząca zlecenia - ${req.body.order_id}">wyślij wiadomość</a>
            </td>
        </tr>
			<tr>
				<td colspan="2">
					<table style="background-color:#474747; padding: 32px 0;" border="0" cellpadding="0" cellspacing="0">
						<tr>
							<td style="width:20%;">
							</td>
							<td valign="bottom" style="width: 60%;">
								<div
									style="text-align: center; width: 395px; color: #999; height: 76px !important; padding-top: 5px; font-size: 10px !important; font-family: Arial, Verdana;">
									© Copyright szparowanie•pl. All rights reserved. <br />
									Nie chce dostawać wiadomości email <a style="color: #999999; text-decoration:none;" href="${process.env.ABSOLUTE_PATH}/unsubscribe/${req.body.user_email}"
										target="_blank">| UNSUBSCRIBE |</a><br /><br />
									<a style="font-size: 12px; color: #fff; font-weight: 600;"
										href="https://szparowanie.pl" target="_blank">szparowanie.pl</a> <br />
									<a style="font-size: 12px; color: #fff; font-weight: 600;"
										href="http://clipping-online.com" target="_blank">clipping-online.com</a>
								</div>
							</td>
							<td style="width:20%;">
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</tbody>
	</table>
</body>
</html>
    `;
    return {
        from: `"szparowanie.pl" <${
            process.env.MAILER_EMAIL
        }>`,
        to: process.env.MAIL_TO,
        subject: `Zlecenie nr:${req.body.order_id} - PDF Z POTWIERDZENIEM`,
        text: htmlToTxt(outputForSzp),
        html: outputForSzp 
    }
};

const szparowanie_paid = (req, res) => { 
    let date = new Date(res.locals.payment.transactions[0].related_resources[0].sale.create_time)
    const outputForSzp = `
    <html>
    <head>
	<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;300;600;900&display=swap" rel="stylesheet">
	<title>Zlecenie nr:${res.locals.order_id} - zostało OPŁACONE</title>
    </head>
    <body
	style="background: #fff; font-family: 'Inter', sans-serif; font-size: 16px; margin-top:0; margin-bottom:0; padding-top:0; padding-bottom:0;">
	<table align="center" cellpadding="0" cellspacing="0" style="border: 0; background: #fff; width: 500px !important;">
		<tbody>
			<tr>
				<td style="background-color: #E4E3E1; padding: 8px">
                <img src="http://szparowanie.nazwa.pl/img/szparowanie_pl.png" alt="&#9986" title='logo of szparowanie.pl' width="20px" height="20px" style="vertical-align: baseline;">
					<a style="vertical-align: top; color:black; text-decoration: none; font-weight: 600; display:inline-block; line-height: 16px; font-size: 16px;" href="http://szparowanie.pl/" target="_blank" title="szparowanie.pl" style="display: block;">
						szparowanie.pl</a>
				</td>
				<tr><td style="font-size: 12px; text-align: right; padding: 0 16px; background-color:#E4E3E1;">nr. zlecenia ${res.locals.order_id}</td></tr>
			</tr>
			<tr>
				<td colspan="1" style="background-color: #E4E3E1; padding: 16px 48px 0; font-size: 16px !important;">
                <img style="vertical-align: baseline; padding:0 20px 0 24px; color: green; font-size: 38px;" src="http://szparowanie.nazwa.pl/img/success.png" alt="&#10004" height="50px" width="50px">
					<h1 style="line-height: 28px !important; display:inline-block; font-size: 24px;">Klient dokonał wpłaty<br/>
                    za zlecenie ${res.locals.order_id}<br/>
					</h1>
				</td> 
			</tr>
            <tr>
            <td colspan="2" style="background-color: #E4E3E1; padding: 24px 48px 14px; font-size: 16px !important;">
                <a  style="display: block; width: 100%; line-height: 48px; text-align: center; font-weight: 600; color:#fff;text-decoration: underline; background-color: #3F3F3F;" href="${process.env.ABSOLUTE_PATH}/adminCPanel/orders/${res.locals.payment_order_ref}">przejdź do zlecenia</a>
            </td>
        </tr>
        <tr>
            <td colspan="2" style="background-color: #E4E3E1; padding: 14px 48px; font-size: 16px !important;">
                <a  style="display: block; width: 100%; line-height: 48px; text-align: center; font-weight: 600; color:#fff;text-decoration: underline; background-color: #8F8F8F;" href="mailto:${res.locals.user_email}?subject=Szparowanie.pl - Widamość dotycząca zlecenia - ${res.locals.order_id}">odpisz na wiadomość</a>
            </td>
        </tr>
			<tr>
				<td colspan="2" style="background-color: #E4E3E1; padding: 24px 48px 48px; font-size: 16px !important;">
					${res.locals.payment.payer.payment_method != undefined ? '<h3 style="font-size:16px; font-weight: 600; margin: 0; padding: 8px 0 0 !important;">metoda: <span style="font-size:16px; font-weight: 300;">' + res.locals.payment.payer.payment_method + '</span></h3>' : ""}
					${date.toDateString() != undefined ? '<h3 style="font-size:16px; font-weight: 600; margin: 0; padding: 8px 0 0 !important;">utworzone: <span style="font-size:16px; font-weight: 300;">' + date.toDateString() + date.toLocaleTimeString() + '</span></h3>' : ""}
					${res.locals.payment.transactions[0].amount.total != undefined ? '<h3 style="font-size:16px; font-weight: 600; margin: 0; padding: 8px 0 0 !important;">kwota: <span style="font-size:16px; font-weight: 300;">' + res.locals.payment.transactions[0].amount.total + res.locals.payment.transactions[0].amount.currency + '</span></h3>' : ""}			
					${res.locals.payment.transactions[0].related_resources[0].sale.transaction_fee.value != undefined ? '<h3 style="font-size:16px; font-weight: 600; margin: 0; padding: 8px 0 0 !important;">prowizja: <span style="font-size:16px; font-weight: 300;">' + res.locals.payment.transactions[0].related_resources[0].sale.transaction_fee.value + '</span></h3>' : ""}			
					${res.locals.payment.transactions[0].related_resources[0].sale.state != undefined ? '<h3 style="font-size:16px; font-weight: 600; margin: 0; padding: 8px 0 0 !important;">stan: <span style="font-size:16px; font-weight: 300;">' + res.locals.payment.transactions[0].related_resources[0].sale.state + '</span></h3>' : ""}			
					${res.locals.payment.transactions[0].item_list.items[0].name != undefined ? '<h3 style="font-size:16px; font-weight: 600; margin: 0; padding: 8px 0 0 !important;">przedmiot płatności: <span style="font-size:16px; font-weight: 300;">' + res.locals.payment.transactions[0].item_list.items[0].name + '</span></h3>' : ""}
                    <br/>			
					${res.locals.payment.payer.payer_info.shipping_address.recipient_name != undefined ? '<h3 style="font-size:16px; font-weight: 600; margin: 0; padding: 8px 0 0 !important;">nazwa płatnika: <span style="font-size:16px; font-weight: 300;">' + res.locals.payment.payer.payer_info.shipping_address.recipient_name + '</span></h3>' : ""}			
					${res.locals.payment.payer.payer_info.email != undefined ? '<h3 style="font-size:16px; font-weight: 600; margin: 0; padding: 8px 0 0 !important;">email: <span style="font-size:16px; font-weight: 300;">' + res.locals.payment.payer.payer_info.email + '</span></h3>' : ""}			
					${res.locals.payment.payer.payer_info.payer_id != undefined ? '<h3 style="font-size:16px; font-weight: 600; margin: 0; padding: 8px 0 0 !important;">id: <span style="font-size:16px; font-weight: 300;">' + res.locals.payment.payer.payer_info.payer_id + '</span></h3>' : ""}			
					${res.locals.payment.payer.payer_info.shipping_address.line1 != undefined ? '<h3 style="font-size:16px; font-weight: 600; margin: 0; padding: 8px 0 0 !important;">adres: <span style="font-size:16px; font-weight: 300;">' + res.locals.payment.payer.payer_info.shipping_address.line1 + '</span></h3>' : ""}			
					${res.locals.payment.payer.payer_info.shipping_address.city != undefined ? '<h3 style="font-size:16px; font-weight: 600; margin: 0; padding: 8px 0 0 !important;"><span style="font-size:16px; font-weight: 300;">' + res.locals.payment.payer.payer_info.shipping_address.city + '</span></h3>' : ""}			
					${res.locals.payment.payer.payer_info.shipping_address.postal_code != undefined ? '<h3 style="font-size:16px; font-weight: 600; margin: 0; padding: 8px 0 0 !important;"><span style="font-size:16px; font-weight: 300;">' + res.locals.payment.payer.payer_info.shipping_address.postal_code + '</span></h3>' : ""}			
					${res.locals.payment.payer.payer_info.shipping_address.country_code != undefined ? '<h3 style="font-size:16px; font-weight: 600; margin: 0; padding: 8px 0 0 !important;"><span style="font-size:16px; font-weight: 300;">' + res.locals.payment.payer.payer_info.shipping_address.country_code + '</span></h3>' : ""}			
				
				</td>
			</tr>
			<tr>
				<td colspan="2">
					<table style="background-color:#474747; padding: 32px 0;" border="0" cellpadding="0" cellspacing="0">
						<tr>
							<td style="width:20%;">
							</td>
							<td valign="bottom" style="width: 60%;">
								<div
									style="text-align: center; width: 395px; color: #999; height: 76px !important; padding-top: 5px; font-size: 10px !important; font-family: Arial, Verdana;">
									© Copyright szparowanie•pl. All rights reserved. <br />
									Nie chce dostawać wiadomości email <a style="color: #999999; text-decoration:none;" href="${process.env.ABSOLUTE_PATH}/unsubscribe/${res.locals.user_email}"
										target="_blank">| UNSUBSCRIBE |</a><br /><br />
									<a style="font-size: 12px; color: #fff; font-weight: 600;"
										href="https://szparowanie.pl" target="_blank">szparowanie.pl</a> <br />
									<a style="font-size: 12px; color: #fff; font-weight: 600;"
										href="http://clipping-online.com" target="_blank">clipping-online.com</a>
								</div>
							</td>
							<td style="width:20%;">
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</tbody>
	</table>
</body>
</html>
    `;
    return {
        from: `"szparowanie.pl" <${
            process.env.MAILER_EMAIL
        }>`,
        to: process.env.MAIL_TO,
        subject: `Zlecenie nr:${res.locals.order_id} - zostało OPŁACONE`,
        text: htmlToTxt(outputForSzp),
        html: outputForSzp 
    }


};
const client_NewOrder = (req, res) => {
    const outputForUser = `
    <html>
    <head>
	<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;300;600;900&display=swap" rel="stylesheet">
	<title>SZPAROWANIE.pl - zlecenie nr. ${res.locals.order_id} - zostało utworzone.</title>
    </head>
    <body
	style="background: #fff; font-family: 'Inter', sans-serif; font-size: 16px; margin-top:0; margin-bottom:0; padding-top:0; padding-bottom:0;">
	<table align="center" cellpadding="0" cellspacing="0" style="border: 0; background: #fff; width: 500px !important;">
		<tbody>
			<tr>
				<td style="background-color: #E4E3E1; padding: 8px">
                <img src="http://szparowanie.nazwa.pl/img/szparowanie_pl.png" alt="&#9986" title='logo of szparowanie.pl' width="20px" height="20px" style="vertical-align: baseline;">
					<a style="vertical-align: top; color:black; text-decoration: none; font-weight: 600; display:inline-block; line-height: 16px; font-size: 16px;" href="http://szparowanie.pl/" target="_blank" title="szparowanie.pl" style="display: block;">
						szparowanie.pl</a>
				</td>
				<tr><td style="font-size: 12px; text-align: right; padding: 0 16px; background-color:#E4E3E1;">nr. zlecenia ${res.locals.order_id}</td></tr>
			</tr>
			<tr>
				<td colspan="1" style="background-color: #E4E3E1; padding: 16px 48px 0; font-size: 16px !important;">
                <img style="vertical-align: baseline; padding:0 10px 0 24px; color: green; font-size: 38px;" src="http://szparowanie.nazwa.pl/img/success.png" alt="&#10004" height="50px" width="50px">
					<h1 style="display:inline-block; line-height:28px; font-size: 24px;">Twoje zlecenie zostało
						<br />
						utworzone!
					</h1>

				</td>
			</tr>
			<tr>
				<td colspan="2"
					style="background-color: #E4E3E1; padding: 24px 48px 8px !important; text-align: center; font-size: 16px !important; ">
					Dziękujemy za przesłanie plików do wyceny,
					nasi graficy oszacują koszt wykonania zlecenia oraz określą przewidywany termin jego realizacji. <br />
					Prosimy oczekiwać na dalsze wiadomości.
				</td>
			</tr>
			<tr>
				<td colspan="2" style="background-color: #E4E3E1; padding: 24px 48px; font-size: 16px !important;">
					<a  style="display: block; width: 100%; line-height: 48px; text-align: center; font-weight: 600; color:#fff;text-decoration: underline; background-color: #3F3F3F;" href="${process.env.ABSOLUTE_PATH}/order/${res.locals.order_ref}">przejdź do zlecenia</a>
				</td>
			</tr>
			<tr>
				<td colspan="2" style="background-color: #E4E3E1; padding: 24px 48px 48px; font-size: 16px !important;">
					<p>
						Poniżej znajdują się szczegóły, które od Ciebie otrzymaliśmy:
					</p>
					<h3 style="font-size:16px; font-weight: 600; margin: 0; padding: 8px 0 0 !important;">ilość plików: <span style="font-size:16px; font-weight: 300;">${Object.keys(req.files).length}</span></h3>
					<h3 style="font-size:16px; font-weight: 600; margin: 0; padding: 8px 0 0 !important;">opis:</h3>
					<p style="font-size:16px; font-weight: 300; margin: 0; padding: 4px 0 0 !important;">${req.body.order_description}</p>
					<h3 style="font-size:16px; font-weight: 600; margin: 0; padding: 8px 0 0 !important;">wyjściowy format plików: <span style="font-size:16px; font-weight: 300;">${req.body.output_file_format != undefined ? req.body.output_file_format : "nie podano"}</span></h3>
					<h3 style="font-size:16px; font-weight: 600; margin: 0; padding: 8px 0 0 !important;">sposób wycinania: <span style="font-size:16px; font-weight: 300;">${req.body.clipping_options != undefined ? req.body.clipping_options : "nie podano"}</span></h3>
					<h3 style="font-size:16px; font-weight: 600; margin: 0; padding: 8px 0 0 !important;">dodatkowe opcje:</h3>
					<p style="font-size:16px; font-weight: 300; margin: 0; padding: 4px 0 0 !important;">${req.body.additional_options_retouch == "1" ? "• retusz<br/>"  : ""}
                    ${req.body.additional_options_light_color == "1" ? "• poprawa koloru / kontrastu<br/>"  : ""}
                    ${req.body.additional_options_crop == "1" ? "• kadrowanie<br/>"  : ""}
                    ${req.body.additional_options_shadow == "1" ? "• dodanie cienia<br/>"  : ""}</p>
				
				</td>
			</tr>
			<tr>
				<td colspan="2">
					<table style="background-color:#474747; padding: 32px 0;" border="0" cellpadding="0" cellspacing="0">
						<tr>
							<td style="width:20%;">
							</td>
							<td valign="bottom" style="width: 60%;">
								<div
									style="text-align: center; width: 395px; color: #999; height: 76px !important; padding-top: 5px; font-size: 10px !important; font-family: Arial, Verdana;">
									© Copyright szparowanie•pl. All rights reserved. <br />
									Nie chce dostawać wiadomości email <a style="color: #999999; text-decoration:none;" href="${process.env.ABSOLUTE_PATH}/unsubscribe/${req.body.user_email}"
										target="_blank">| UNSUBSCRIBE |</a><br /><br />
									<a style="font-size: 12px; color: #fff; font-weight: 600;"
										href="https://szparowanie.pl" target="_blank">szparowanie.pl</a> <br />
									<a style="font-size: 12px; color: #fff; font-weight: 600;"
										href="http://clipping-online.com" target="_blank">clipping-online.com</a>
								</div>
							</td>
							<td style="width:20%;">
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</tbody>
	</table>
</body>

</html>`;
    return {
        from: `"szparowanie.pl" <${
            process.env.MAILER_EMAIL
        }>`,
        to: req.body.user_email,
        subject: `SZPAROWANIE.pl - zlecenie nr. ${res.locals.order_id} - zostało utworzone.`,
        text: htmlToTxt(outputForUser),
        html: outputForUser 
    }

};

const client_Processing_order = (req, res) => {
    let c_date = req.body.completion_date
    const dt = new Date(c_date)
    const outputForUser = `
    <html>
    <head>
        <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;300;600;900&display=swap" rel="stylesheet">
        <title>SZPAROWANIE.pl - zlecenie nr. ${req.body.order_id} - przyjęte do realizacji.</title>
    </head>

<body
	style="background: #fff; font-family: 'Inter', sans-serif; font-size: 16px; margin-top:0; margin-bottom:0; padding-top:0; padding-bottom:0;">
	<table align="center" cellpadding="0" cellspacing="0" style="border: 0; background: #fff; width: 500px !important;">
		<tbody>
			<tr>
				<td style="background-color: #E4E3E1; padding: 8px">
					<img src="http://szparowanie.nazwa.pl/img/szparowanie_pl.png" alt="&#9986" title='logo of szparowanie.pl' width="20px" height="20px" style="vertical-align: baseline;">
					<a style="vertical-align: top; color:black; text-decoration: none; font-weight: 600; display:inline-block; line-height: 16px; font-size: 16px;" href="http://szparowanie.pl/" target="_blank" title="szparowanie.pl" style="display: block;">
						szparowanie.pl</a>
				</td>
				<tr><td style="font-size: 12px; text-align: right; padding: 0 16px; background-color:#E4E3E1;">nr. zlecenia ${req.body.order_id}<br/>
					utworzone ${req.body.created_date}</td></tr>
			</tr>
			<tr>
				<td colspan="1" style="background-color: #E4E3E1; padding: 16px 48px 0; font-size: 16px !important;">
					<img style="vertical-align: baseline; padding:0 16px 0 18px; color: green; font-size: 38px;" src="http://szparowanie.nazwa.pl/img/success.png" alt="&#10004" height="50px" width="50px">
                    <h1 style="display:inline-block; line-height:28px; font-size: 24px;">Twoje zlecenie zostało
                    <br />
                    przyjęte do realizacji. 
                </h1>
  
				</td>
			</tr>
			<tr>
				<td colspan="2"
					style="background-color: #E4E3E1; padding: 24px 48px 8px !important; text-align: left; font-size: 16px !important; ">
					Poniżej aktualny stan Twojego zlecenia: <br/>
                    <h3 style="font-size:16px; font-weight: 600; margin: 0; padding: 8px 0 0 !important;">status: <span style="font-size:16px; font-weight: 300;">${req.body.order_status}</span></h3>
                    <h3 style="font-size:16px; font-weight: 600; margin: 0; padding: 8px 0 0 !important;">płatność: <span style="font-size:16px; font-weight: 300;">${req.body.payment_status}</span></h3>
                    <h3 style="font-size:16px; font-weight: 600; margin: 0; padding: 8px 0 0 !important;">koszt: <span style="font-size:16px; font-weight: 300;">${req.body.order_price}</span></h3>
                    <h3 style="font-size:16px; font-weight: 600; margin: 0; padding: 8px 0 0 !important;">termin realizacji: <span style="font-size:16px; font-weight: 300;">${dt.toLocaleDateString()}</span></h3>

				</td>
			</tr>
			<tr>
				<td colspan="2" style="background-color: #E4E3E1; padding: 24px 48px; font-size: 16px !important;">
					<a  style="display: block; width: 100%; line-height: 48px; text-align: center; font-weight: 600; color:#fff;text-decoration: underline; background-color: #3F3F3F;" href="${process.env.ABSOLUTE_PATH}/order/${req.body.order_ref}" target="_blank" title="przejdź do zlecenia">przejdź do zlecenia</a>
				</td>
			</tr>
			<tr>
				<td colspan="2" style="background-color: #E4E3E1; padding: 24px 48px 48px; font-size: 16px !important; text-align: center !important;">
					<p>
						Odezwiemy się do Ciebie wkrótce. <br/>
                        Do usłyszenia!
					</p>
                    <p>
                    ${ req.body.uwagi.length <= 0 ? "" : "<b>Dodatkowe uwagi:</b><br>" + req.body.uwagi + "<br></br><br>"}
                    </p>
				</td>
			</tr>
			<tr>
				<td colspan="2">
					<table style="background-color:#474747; padding: 32px 0;" border="0" cellpadding="0" cellspacing="0">
						<tr>
							<td style="width:20%;">
							</td>
							<td valign="bottom" style="width: 60%;">
								<div
									style="text-align: center; width: 395px; color: #999; height: 76px !important; padding-top: 5px; font-size: 10px !important; font-family: Arial, Verdana;">
									© Copyright szparowanie•pl. All rights reserved. <br />
									Nie chce dostawać wiadomości email <a style="color: #999999; text-decoration:none;" href="${process.env.ABSOLUTE_PATH}/unsubscribe/${req.body.user_email}"
                                    target="_blank">| UNSUBSCRIBE |</a><br /><br />
									<a style="font-size: 12px; color: #fff; font-weight: 600;"
										href="https://szparowanie.pl" target="_blank">szparowanie.pl</a> <br />
									<a style="font-size: 12px; color: #fff; font-weight: 600;"
										href="http://clipping-online.com" target="_blank">clipping-online.com</a>
								</div>
							</td>
							<td style="width:20%;">
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</tbody>
	</table>
</body>

</html>
    `;
    return {
        from: `"szparowanie.pl" <${
            process.env.MAILER_EMAIL
        }>`,
        to: req.body.user_email,
        subject: `SZPAROWANIE.pl - zlecenie nr. ${req.body.order_id} - przyjęte do realizacji.`,
        text: htmlToTxt(outputForUser),
        html: outputForUser 
    }

};

const client_Accept_and_Pay = (req, res) => {
    const outputForUser = `
<html>
    <head>
        <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;300;600;900&display=swap" rel="stylesheet">
        <title>SZPAROWANIE.pl - zlecenie nr. ${req.body.order_id} - wycena.</title>
    </head>

<body
	style="background: #fff; font-family: 'Inter', sans-serif; font-size: 16px; margin-top:0; margin-bottom:0; padding-top:0; padding-bottom:0;">
	<table align="center" cellpadding="0" cellspacing="0" style="border: 0; background: #fff; width: 530px !important;">
		<tbody>
			<tr>
				<td style="background-color: #E4E3E1; padding: 8px">
					<img src="http://szparowanie.nazwa.pl/img/szparowanie_pl.png" alt="&#9986" title='logo of szparowanie.pl' width="20px" height="20px" style="vertical-align: baseline;">
					<a style="vertical-align: top; color:black; text-decoration: none; font-weight: 600; display:inline-block; line-height: 16px; font-size: 16px;" href="http://szparowanie.pl/" target="_blank" title="szparowanie.pl" style="display: block;">
						szparowanie.pl</a>
				</td>
				<tr><td style="font-size: 12px; text-align: right; padding: 0 16px; background-color:#E4E3E1;">nr. zlecenia ${req.body.order_id}<br/>
					utworzone ${req.body.created_date}</td></tr>
			</tr>
			<tr>
				<td colspan="1" style="background-color: #E4E3E1; padding: 16px 48px 0; font-size: 16px !important;">
					<img style="vertical-align: baseline; padding:0 10px 0 24px; color: green; font-size: 38px;" src="http://szparowanie.nazwa.pl/img/success.png" alt="&#10004" height="50px" width="50px">
					<h1 style="display:inline-block; line-height:28px; font-size: 24px;">Znamy już koszt i termin<br />
						realizacji Twojego zlecenia!
					</h1>
  
				</td>
			</tr>
			<tr>
				<td colspan="2"
					style="background-color: #E4E3E1; padding: 24px 48px 8px !important; text-align: center; font-size: 16px !important; ">
					Zapoznaliśmy się z przesłanymi przez Ciebie informacjami, w oparciu o nie <br />przygotowaliśmy dla Ciebie ofertę.

				</td>
			</tr>
			<tr>
				<td colspan="2" style="background-color: #E4E3E1; padding: 24px 48px; font-size: 16px !important;">
					<a  style="display: block; width: 100%; line-height: 48px; text-align: center; font-weight: 600; color:#fff;text-decoration: underline; background-color: #149747;" href="${process.env.ABSOLUTE_PATH}/accept/${req.body.order_ref}" target="_blank" title="zobacz ofertę">zobacz ofertę</a>
				</td>
			</tr>
			<tr>
				<td colspan="2" style="background-color: #E4E3E1; padding: 0px 48px 48px; font-size: 16px !important; text-align: center !important;">
					<p>
						Kliknij na przycisk powyżej aby poznać szczegóły <br/>i potwierdzić ofertę.
					</p>
                    <p>
                    ${ req.body.uwagi.length <= 0 ? "" : "<b>Dodatkowe uwagi:</b><br>" + req.body.uwagi + "<br></br><br>"}
                    </p>
				</td>
			</tr>
			<tr>
				<td colspan="2">
					<table style="background-color:#474747; padding: 32px 0;" border="0" cellpadding="0" cellspacing="0">
						<tr>
							<td style="width:20%;">
							</td>
							<td valign="bottom" style="width: 60%;">
								<div
									style="text-align: center; width: 395px; color: #999; height: 76px !important; padding-top: 5px; font-size: 10px !important; font-family: Arial, Verdana;">
									© Copyright szparowanie•pl. All rights reserved. <br />
									Nie chce dostawać wiadomości email <a style="color: #999999; text-decoration:none;" href="${process.env.ABSOLUTE_PATH}/unsubscribe/${req.body.user_email}"
                                    target="_blank">| UNSUBSCRIBE |</a><br /><br />
									<a style="font-size: 12px; color: #fff; font-weight: 600;"
										href="https://szparowanie.pl" target="_blank">szparowanie.pl</a> <br />
									<a style="font-size: 12px; color: #fff; font-weight: 600;"
										href="http://clipping-online.com" target="_blank">clipping-online.com</a>
								</div>
							</td>
							<td style="width:20%;">
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</tbody>
	</table>
</body>

</html>
    `;
    return {
        from: `"szparowanie.pl" <${
            process.env.MAILER_EMAIL
        }>`,
        to: req.body.user_email,
        subject: `SZPAROWANIE.pl - zlecenie nr. ${req.body.order_id} - wycena.`,
        text: htmlToTxt(outputForUser),
        html: outputForUser 
    }

};

const client_Ready_Link = (req, res) => {
    const outputForUser = `
    <html>
    <head>
        <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;300;600;900&display=swap" rel="stylesheet">
        <title>SZPAROWANIE.pl - zlecenie nr. ${req.body.order_id} - jest GOTOWE.</title>
    </head>

<body
	style="background: #fff; font-family: 'Inter', sans-serif; font-size: 16px; margin-top:0; margin-bottom:0; padding-top:0; padding-bottom:0;">
	<table align="center" cellpadding="0" cellspacing="0" style="border: 0; background: #fff; width: 530px !important;">
		<tbody>
			<tr>
				<td style="background-color: #E4E3E1; padding: 8px">
					<img src="http://szparowanie.nazwa.pl/img/szparowanie_pl.png" alt="&#9986" title='logo of szparowanie.pl' width="20px" height="20px" style="vertical-align: baseline;">
					<a style="vertical-align: top; color:black; text-decoration: none; font-weight: 600; display:inline-block; line-height: 16px; font-size: 16px;" href="http://szparowanie.pl/" target="_blank" title="szparowanie.pl" style="display: block;">
						szparowanie.pl</a>
				</td>
				<tr><td style="font-size: 12px; text-align: right; padding: 0 16px; background-color:#E4E3E1;">nr. zlecenia ${req.body.order_id}<br/>
					utworzone ${req.body.created_date}</td></tr>
			</tr>
			<tr>
				<td colspan="1" style="background-color: #E4E3E1; padding: 16px 48px 0; font-size: 16px !important;">
					<img style="vertical-align: baseline; padding:0 10px 0 24px; color: green; font-size: 38px;" src="http://szparowanie.nazwa.pl/img/success.png" alt="&#10004" height="50px" width="50px">
					<h1 style="display:inline-block;  font-size: 24px;">
                    Twoje zlecenie nr ${req.body.order_id}<br />
                    jest gotowe do pobrania!
                    </h1>
  
				</td>
			</tr>
			<tr>
				<td colspan="2"
					style="background-color: #E4E3E1; padding: 24px 48px 8px !important; text-align: center; font-size: 16px !important; ">
					Kliknij na link poniżej,<br />
                    aby pobrać gotowe zdjęcia.

				</td>
			</tr>
			<tr>
				<td colspan="2" style="background-color: #E4E3E1; padding: 24px 48px; font-size: 16px !important;">
					<a  style="display: block; width: 100%; line-height: 48px; text-align: center; font-weight: 600; color:#fff;text-decoration: underline; background-color: #149747;" href="${req.body.ready_package_link}" target="_blank" title="pobierz pliki">pobierz pliki</a>
				</td>
			</tr>
			<tr>
				<td colspan="2" style="background-color: #E4E3E1; padding: 24px 48px 48px; font-size: 16px !important; text-align: center !important;">
                <p>
                ${ req.body.uwagi.length <= 0 ? "" : "<b>Dodatkowe uwagi:</b><br>" + req.body.uwagi + "<br></br><br>"}
                </p>	
                <p>
                Dziękujemy i zapraszamy ponownie!
				</p>

				</td>
			</tr>
			<tr>
				<td colspan="2">
					<table style="background-color:#474747; padding: 32px 0;" border="0" cellpadding="0" cellspacing="0">
						<tr>
							<td style="width:20%;">
							</td>
							<td valign="bottom" style="width: 60%;">
								<div
									style="text-align: center; width: 395px; color: #999; height: 76px !important; padding-top: 5px; font-size: 10px !important; font-family: Arial, Verdana;">
									© Copyright szparowanie•pl. All rights reserved. <br />
									Nie chce dostawać wiadomości email <a style="color: #999999; text-decoration:none;" href="${process.env.ABSOLUTE_PATH}/unsubscribe/${req.body.user_email}"
                                    target="_blank">| UNSUBSCRIBE |</a><br /><br />
									<a style="font-size: 12px; color: #fff; font-weight: 600;"
										href="https://szparowanie.pl" target="_blank">szparowanie.pl</a> <br />
									<a style="font-size: 12px; color: #fff; font-weight: 600;"
										href="http://clipping-online.com" target="_blank">clipping-online.com</a>
								</div>
							</td>
							<td style="width:20%;">
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</tbody>
	</table>
</body>

</html>
    `;
    return {
        from: `"szparowanie.pl" <${
            process.env.MAILER_EMAIL
        }>`,
        to: req.body.user_email,
        subject: `SZPAROWANIE.pl - zlecenie nr. ${req.body.order_id} - jest GOTOWE.`,
        text: htmlToTxt(outputForUser),
        html: outputForUser 
    }

};


const resetLink = (req, res) => {
    const outputForUser = `
    <html>
    <head>
	<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;300;600;900&display=swap" rel="stylesheet">
	<title>SZPAROWANIE.pl - Reset hasła dla konta ${req.body.email}</title>
    </head>
    <body
	style="background: #fff; font-family: 'Inter', sans-serif; font-size: 16px; margin-top:0; margin-bottom:0; padding-top:0; padding-bottom:0;">
	<table align="center" cellpadding="0" cellspacing="0" style="border: 0; background: #fff; width: 500px !important;">
		<tbody>
			<tr>
				<td style="background-color: #E4E3E1; padding: 8px">
                <img src="http://szparowanie.nazwa.pl/img/szparowanie_pl.png" alt="&#9986" title='logo of szparowanie.pl' width="20px" height="20px" style="vertical-align: baseline;">
					<a style="vertical-align: top; color:black; text-decoration: none; font-weight: 600; display:inline-block; line-height: 16px; font-size: 16px;" href="http://szparowanie.pl/" target="_blank" title="szparowanie.pl" style="display: block;">
						szparowanie.pl</a>
				</td>
			</tr>
			<tr>
				<td colspan="1" style="text-align: center; background-color: #E4E3E1; padding: 16px 48px 0; font-size: 16px !important;">                
					<h1 style="display:inline-block;  font-size: 24px; text-decoration:none !important; color: #000;">Wygenerowana została próba<br/>
                    zmiany hasła użytkowinika<br/>
                    dla konta ${req.body.email}
					</h1>

				</td>
			</tr>
			<tr>
				<td colspan="2" style="background-color: #E4E3E1; padding: 24px 48px; font-size: 16px !important;">
					<a  style="display: block; width: 100%; line-height: 48px; text-align: center; font-weight: 600; color:#fff;text-decoration: underline; background-color: #3F3F3F;" href="${process.env.ABSOLUTE_PATH}/resetpassword/${res.locals.userRef}">resetuj hasło</a>
				</td>
			</tr>
			<tr>
				<td colspan="2" style="text-align: center; background-color: #E4E3E1; padding: 24px 48px 48px; font-size: 16px !important;">
					<p>
                    Jeśli próba resetu hasła <b>nie jest</b> wynikiem<br/>
                      Twoich działań - <b>zignoruj tę wiadomość.</b>
					</p>				
				</td>
			</tr>
			<tr>
				<td colspan="2">
					<table style="background-color:#474747; padding: 32px 0;" border="0" cellpadding="0" cellspacing="0">
						<tr>
							<td style="width:20%;">
							</td>
							<td valign="bottom" style="width: 60%;">
								<div
									style="text-align: center; width: 395px; color: #999; height: 76px !important; padding-top: 5px; font-size: 10px !important; font-family: Arial, Verdana;">
									© Copyright szparowanie•pl. All rights reserved. <br />
									Nie chce dostawać wiadomości email <a style="color: #999999; text-decoration:none;" href="${process.env.ABSOLUTE_PATH}/unsubscribe/${req.body.user_email}"
										target="_blank">| UNSUBSCRIBE |</a><br /><br />
									<a style="font-size: 12px; color: #fff; font-weight: 600;"
										href="https://szparowanie.pl" target="_blank">szparowanie.pl</a> <br />
									<a style="font-size: 12px; color: #fff; font-weight: 600;"
										href="http://clipping-online.com" target="_blank">clipping-online.com</a>
								</div>
							</td>
							<td style="width:20%;">
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</tbody>
	</table>
</body>

</html>
`;
    return {
        from: `"szparowanie.pl" <${
            process.env.MAILER_EMAIL
        }>`,
        to: req.body.email,
        subject: `SZPAROWANIE.pl - Reset hasła dla konta ${
            req.body.email
        }`,
        text: htmlToTxt(outputForUser),
        html: outputForUser // html body
    }
};




module.exports.szparowanie_free = szparowanie_free;
module.exports.szparowanie_NewOrder = szparowanie_NewOrder;
module.exports.szparowanie_message = szparowanie_message;
module.exports.szparowanie_decline = szparowanie_decline;
module.exports.client_NewOrder = client_NewOrder;
module.exports.client_Processing_order = client_Processing_order;
module.exports.client_Accept_and_Pay = client_Accept_and_Pay;
module.exports.szparowanie_confirmed_pdf = szparowanie_confirmed_pdf;
module.exports.szparowanie_paid = szparowanie_paid;
module.exports.client_Ready_Link = client_Ready_Link;
module.exports.resetLink = resetLink;
