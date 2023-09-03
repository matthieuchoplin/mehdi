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
  const [formData, setFormData] = useState({ reference_pp: '', operation_name: '' });

  async function handleSubmit(event) {
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
      }

      setValidated(true);
      if (form.checkValidity() === true) {
          event.preventDefault();
          try {
              const result = await generateDocument(formData, template);
              console.log('Promise result:', result);
          } catch (err) {
              console.log(err.message || 'An error occurred');
          }
      }
  }

  return (
      <div>
        <h2>Renseignements généraux</h2>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>

          <Row className="mb-3">
            <Form.Group as={Col} md="4" controlId="validationCustom01">
              <Form.Label>Référence PP</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Réaménagement du site"
                value={formData.reference_pp}
                onChange={(e) => setFormData({ ...formData, reference_pp: e.target.value })}
              />
            </Form.Group>
            <Form.Group as={Col} md="8" controlId="validationCustom02">
              <Form.Label>Intitulé de l'opération / Nature des travaux</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="XXXX"
                value={formData.operation_name}
                onChange={(e) => setFormData({ ...formData, operation_name: e.target.value })}
              />
            </Form.Group>
          </Row>
          <Button type="submit">Générer rapport</Button>
        </Form>
      </div>
  );
}

async function generateDocument(data, templatePath) {
    let doc_params = {
              reference_pp: data.reference_pp,
              operation_name: data.operation_name,
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
    </div>
  );
}

export default App;
