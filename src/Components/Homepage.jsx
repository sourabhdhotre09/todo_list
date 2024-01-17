import React from 'react'
import { useEffect,useState } from 'react';
import { MdDelete,MdDone,MdDoneAll} from "react-icons/md";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FaEdit } from "react-icons/fa";
import axios from 'axios';

const Homepage = () => {
  const [title, setTitle] =useState('');
  const [description, setDescription] =useState('');
  const [CreatemodalShow, setCreateModalShow] = useState(false);
  const [UpdateModalShow, setUpdateModalShow] = useState(false);
  const [data, getData] = useState([]);
  const [updateId, setUpdateId] = useState();
  const [bool, setBool] =useState ();
  

  const [UpdateValues, setUpdateValues] = useState({
    Title:'',
    Description:'',
    done:'',
  })
  
  let fetchData = async () => {
    try {
      const response = await axios.get('https://65964c386bb4ec36ca024a58.mockapi.io/crud-app/todo_list');
      getData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  useEffect(() => {
    fetchData();
  }, [])


  
  function handleSubmit(e){
    e.preventDefault();
    axios.post('https://65964c386bb4ec36ca024a58.mockapi.io/crud-app/todo_list',
      {
        Title:title,
        Description:description,
      }
    )
    .then(()=>{
      fetchData();
    })
    .catch((err) => {
      console.log(err);
    });

    setCreateModalShow(false);
  }


  // console.log(1,updateId);
  function handleUpdatePopup(e){
    setUpdateModalShow(true);
    setUpdateId(e);
    axios.get(`https://65964c386bb4ec36ca024a58.mockapi.io/crud-app/todo_list/${e}`)
    .then((res)=>{
      setUpdateValues({...UpdateValues, Title:res.data.Title,Description:res.data.Description})
    })

  }
  

  // console.log(2,UpdateValues.Title);
  function handleUpdate(e){
    e.preventDefault();
    axios.put(`https://65964c386bb4ec36ca024a58.mockapi.io/crud-app/todo_list/${updateId}`,
      {
        Title:UpdateValues.Title,
        Description:UpdateValues.Description,
      }
    )
    .then(()=>{
      fetchData();
    })
    .catch((err)=>{
      console.log(err);
    })
    setUpdateModalShow(false);
  }
  
  


  function handleDelete(e){
    axios.delete(`https://65964c386bb4ec36ca024a58.mockapi.io/crud-app/todo_list/${e}`)
    .then(()=>{
      fetchData();
    })
    
  }

  // console.log(1,UpdateValues.done);
  const toggleHideShow = (valueId) => {
    (async()=>{
      const fetchtogglevalue = await axios.get(`https://65964c386bb4ec36ca024a58.mockapi.io/crud-app/todo_list/${valueId}`);

      setUpdateValues({...UpdateValues,done:fetchtogglevalue.data.done})
      console.log(2,fetchtogglevalue.data);
    })();
    console.log("UpdateValues.done",UpdateValues.done)
    setBool(!UpdateValues.done);
    
    (async()=>{
      await axios.put(`https://65964c386bb4ec36ca024a58.mockapi.io/crud-app/todo_list/${valueId}`,
        {
          done:bool,
        }
      )
      fetchData();
    })();

  };

  console.log(data);
  return (
    <>
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="card my-4">
            <div className="row">
              <div className="col-md-12 text-center my-2">
                <h4>My ToDo List</h4>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 text-end">
                <button className="open-popup btn btn-success my-2 mx-3" onClick={() => setCreateModalShow(true)}>
                  Add New
                </button>
              </div>
            </div>
            <div className="row lists my-2">
              <div className="col-md-12">
                {
                  data
                  .sort((a, b) => b.id - a.id)
                  // .sort().reverse()
                  .map((value,index) =>
                    <div className="list" key={value.id}>
                      <div className="content">
                        <h5 className="title">{value.Title}</h5>
                        <p className="description">{value.Description}</p>
                      </div>
                      <div className="btns d-flex">
                      <button className='btn' onClick={() => toggleHideShow(value.id)}>
                        {!value.done ? (
                            <MdDone style={{ color: '#00FFF5' }} size={25} />
                          ): (
                            <MdDoneAll style={{ color: '#00FFF5' }} size={25} />
                        )}
                      </button>
                        {
                          !value.done ? 
                          <button className='btn' onClick={()=>handleUpdatePopup(value.id)}><FaEdit style={{color:'#589cef'}} size={25} /></button>:null
                        }
                        <button className='btn' onClick={()=>handleDelete(value.id)}><MdDelete style={{color:'#cc3216'}} size={25} /></button>
                      </div>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Create new Data */}
    <Modal aria-labelledby="contained-modal-title-vcenter"
      show={CreatemodalShow}
      onHide={() => setCreateModalShow(false)}
      centered>
      <Modal.Body>
          <form action="">
            <div className="row">
              <div className="col-md-12">
                <div className="form-group mb-3">
                  <label htmlFor="title" className="label">Enter Title:</label>
                  <input type="text" className='form-control' id='title'
                  onChange={(e)=>setTitle(e.target.value)} 
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="description" className="label">Enter Description:</label>
                  <textarea name="description" id="description" className='form-control' rows="3"
                  onChange={(e)=>setDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="col-md-12">
                <div className="btn-div d-flex justify-content-end">
                    <input type="submit" className='btn btn-success mx-2' onClick={handleSubmit} value="Add Data" />
                    <Button className='btn btn-secondary' onClick={() => setCreateModalShow(false)}>Cancel</Button>
                  </div>
              </div>
            </div>
          </form>
      </Modal.Body>
    </Modal>


    {/* Update New Data */}
    <Modal aria-labelledby="contained-modal-title-vcenter"
      show={UpdateModalShow}
      onHide={() => setUpdateModalShow(false)}
      centered>
      <Modal.Body>
          <form action="">
            <div className="row">
              <div className="col-md-12">
                <div className="form-group mb-3">
                  <label htmlFor="title" className="label">Enter Title:</label>
                  <input type="text" className='form-control' id='title' onChange={(e)=>setUpdateValues({...UpdateValues,Title:e.target.value})} value={UpdateValues.Title}/>
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="description" className="label">Enter Description:</label>
                  <textarea name="description" id="description" className='form-control' onChange={(e)=>setUpdateValues({...UpdateValues,Description:e.target.value})} value={UpdateValues.Description} rows="3"></textarea>
                </div>
                
              </div>
              <div className="col-md-12">
                <div className="btn-div d-flex justify-content-end">
                    <input type="submit" className='btn btn-success mx-2' onClick={handleUpdate} value="Update"/>
                    <Button className='btn btn-secondary' onClick={() => setUpdateModalShow(false)}>Cancel</Button>
                  </div>
              </div>
            </div>
          </form>
      </Modal.Body>
    </Modal>
    </>
  )
}

export default Homepage