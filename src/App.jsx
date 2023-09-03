import './App.css';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import Button from 'react-bootstrap/Button';
import { saveAs } from 'file-saver';

import template from './template_light_sav.docx';
import { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

function FormGeneralInfo() {
  const [validated, setValidated] = useState(false);
  const [reference_pp, setReference_pp] = useState("");
  const [operation_name, setOperation_name] = useState("");

  const handleSubmit = (event) => {
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
      }

      setValidated(true);
      if (form.checkValidity() === true) {
          console.log("heeeere")
          console.log(reference_pp);
          console.log(operation_name);
      }
  }

  return (
      <div>
        <h2>Renseignements généraux</h2>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>

          <Row className="mb-3">
            <Form.Group as={Col} md="8" controlId="validationCustom01">
              <Form.Label>Intitulé de l'opération / Nature des travaux</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Réaménagement du site"
                // defaultValue=""
                value={reference_pp}
                onChange={(e) => setReference_pp(e.target.value)}
              />
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="validationCustom02">
              <Form.Label>Numéro de commande</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="XXXX"
                // defaultValue="Otto"
                value={operation_name}
                onChange={(e) => setOperation_name(e.target.value)}
              />
            </Form.Group>
          </Row>
          {/* TODO: how to call the promise from the submit handler? */}
          {/*<Button type="submit">Générer rapport</Button>*/}
          <Button onClick={() => generateDocument({reference_pp, operation_name}, template)}>Générer rapport</Button>
        </Form>
      </div>
  );
}

async function generateDocument({reference_pp, operation_name}, templatePath) {
    let doc_params = {
              reference_pp: reference_pp,
              operation_name: operation_name,
              nature_des_travaux: "bla3",
              nom_et_address_du_site: "bla3",
              code_nidt_noim: "bla3",
              start_date_planned: "bla3",
              end_date_planned: "bla3",
              entreprise_titulaire_du_marche: "bla3",
              plage_horaire: "bla3"
          }
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

function App() {
  return (
    <div className="App">
        <FormGeneralInfo />
        {/*<Button onClick={() => generateDocument(doc_params, template)}>Generer rapport</Button>*/}
        {/*<button onClick={() => generateDocument(doc_params, template)}>Generer rapport</button>*/}
    </div>
  );
}

export default App;
