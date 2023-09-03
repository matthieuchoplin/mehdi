import './App.css';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import Button from 'react-bootstrap/Button';
import { saveAs } from 'file-saver';

import template from './template_light_sav.docx';

function App() {
    let doc_params = {
    reference_pp: "bla1",
    operation_name: "bla2",
    nature_des_travaux: "bla3",
    nom_et_address_du_site: "bla3",
    code_nidt_noim: "bla3",
    start_date_planned: "bla3",
    end_date_planned: "bla3",
    entreprise_titulaire_du_marche: "bla3",
    plage_horaire: "bla3"
}

    async function generateDocument(doc_params, templatePath) {
        // load the document template into docxtemplater
        try {
            let response = await fetch(templatePath);
            let data = await response.arrayBuffer();

            let zip = PizZip(data);

            let templateDoc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true
            })

            templateDoc.render(doc_params);

            let generatedDoc = templateDoc.getZip().generate({
                type: "blob",
                mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                compression: "DEFLATE"
            })

            saveAs(generatedDoc, `${doc_params.reference_pp}.docx`);
        } catch (error) {
            console.log('Error: ' + error);
        }
    }

  return (
    <div className="App">
      <header className="App-header">
        <Button onClick={() => generateDocument(doc_params, template)}>Generer rapport</Button>
        {/*<button onClick={() => generateDocument(doc_params, template)}>Generer rapport</button>*/}
      </header>
    </div>
  );
}

export default App;
