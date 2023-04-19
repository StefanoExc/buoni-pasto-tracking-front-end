import React, { useState } from 'react';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardHeader, MDBCol, MDBInput, 
  MDBListGroup, MDBListGroupItem, MDBRow, MDBTypography } from 'mdb-react-ui-kit';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import moment from 'moment';

const Home = () => {

  const[state] = useState();
  const[dati,setDati] = useState([]);
  const[isLoaded, setIsLoaded] = useState(false);

  const[utente,setUtente] = useState();
  const[dataora] = useState();
  const[datautilizzo, setDatautilizzo] = useState();
  const[tipo, setTipo] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(state);
  }

  const updateData = () => {
    fetch(`http://localhost:8000/api/send`, {
      method: "POST",
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        utente:utente,
        dataora:dataora,
        datautilizzo:moment(datautilizzo).format("DD/MM/YYYY"),
        tipo:tipo
      })
    })
    .then((response) => response.json())
    .then((dati) => {
      setDati(dati);
      console.log(dati)
    })
    .catch((er) => console.log(er))
  }

  const sendData = () =>{

    fetch(`http://localhost:8000/api/save-buono`, {
      method: "POST",
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        utente:utente,
        dataora:dataora,
        datautilizzo:moment(datautilizzo).format("DD/MM/YYYY"),
        tipo:tipo
      })
    })
    .then((response) => response.json())
    .then( () => {
      setIsLoaded(true)
    })
    .then(updateData())
    .catch((er) => console.log(er))
  }

  return (
    <div className="mx-auto mt-5" style={{ maxWidth: '900px' }}>
      <MDBRow>
        <MDBCol md="8" className="mb-4">
          <MDBCard className="mb-4">
            <MDBCardHeader className="py-3">
              <MDBTypography tag="h5" className="mb-0">Buoni Pasto</MDBTypography>
            </MDBCardHeader>
            <MDBCardBody>
              <form onSubmit={handleSubmit} method='post' action='/'>
                <MDBRow className="mb-4">
                  <MDBCol>
                    <MDBInput label='Utente' id="utente" type='text' onChange={(element) =>{
                      setUtente(element.target.value);
                    }} />
                  </MDBCol>
                  
                </MDBRow>
                
                <MDBInput label='Data utilizzo' id="datautilizzo" type='date' className="mb-4" onChange={(element) =>{
                      setDatautilizzo(element.target.value);
                    }}/>

                <div className="d-flex justify-content-center">
                  <MDBRow className="mb-4">
                  <Form.Select aria-label="Default select example" id="tipo" onChange={(element) => {
                    setTipo(element.target.value);
                  }}>
                    <option>Seleziona un tipo</option>
                    <option value="B">Bagaria |B|</option>
                    <option value="R">Ristò |R|</option>
                    <option value="A">Altro |A|</option>
                  </Form.Select>
                  </MDBRow>
                </div>

                {isLoaded ? (
                  <Table id='table' className='table' striped bordered hover>
                      <thead>
                          <tr>
                          <th>Utente</th>
                          <th>Tipo</th>
                          <th>Data Buono</th>
                          </tr>
                      </thead>
                      <tbody>
                      {
                        dati?.map((buono, buoni) =>{
                          return (
                          <tr key={buoni}>
                            <td>{buono.utente}</td>
                            <td>{buono.tipo}</td>
                            <td>{buono.datautilizzo}</td>
                          </tr>
                          )                                  
                        })
                      }
                      </tbody>
                  </Table>
                ) : (<h1>null</h1>)}
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol md="4" className="mb-4">
          <MDBCard className="mb-4">
            <MDBCardHeader className="py-3">
              <MDBTypography tag="h5" className="mb-0">Riepilogo</MDBTypography>
            </MDBCardHeader>
            <MDBCardBody>
              <MDBListGroup flush = "true">
              <MDBListGroupItem className="d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                  Utente
                  <span>{utente}</span>
                </MDBListGroupItem>
                <MDBListGroupItem className="d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                  Data 
                  <span>{datautilizzo}</span>
                </MDBListGroupItem>
                <MDBListGroupItem className="d-flex justify-content-between align-items-center px-0">
                  Tipo
                  <span>{tipo}</span>
                </MDBListGroupItem>
              </MDBListGroup>

              <MDBBtn size="lg" onClick={sendData} block>
                Salva
              </MDBBtn>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>

      
    </div>
    
  );
}

export default Home;