import React,{useState} from 'react';
import {connect} from 'react-redux';
import {storage, database }from '../utils/firebase';
const Form =props =>{
    const [patientPhoto,setPatientPhoto]=useState('');
    const [sendForm,setSendForm]= useState(false);
    const handleSubmit=event=>{
        console.log('foto',patientPhoto);
        event.preventDefault();
        const form  = new FormData(event.target);
        const newDate = new Date().toISOString();
        let id= newDate.toString().replace(/T|-|:|Z/g,'')
        id = id.substring(0,id.length-4);
        
        const data = {
            'firstName':form.get('firstName'),
            'lastName':form.get('lastName'),
            'type':form.get('type'),
            'date':newDate,
            'description':form.get('description'),
            'gender': form.get('gender'),
            'photo': patientPhoto,
            'profilePic':props.user.photoURL,
            'userContact':props.user.email,
            'userName':props.user.displayName,
            'Measures':[{peso:form.get('initialWeight'),Medida:1}],
            'id':id,
        }
        id!=''?
        database.ref('patients/'+id).set(data).then(() => setSendForm(true)).catch(()=>setSendForm(false)):
        console.log('Error guardando')
    }

    const onChange = event =>{
        const file = event.target.files[0];
        const storageRef = storage.ref();
        const name= (+new Date())+'-'+file.name;
        const uploadFile = storageRef.child(name).put(file);

        uploadFile.then((snapshot)=>{
            snapshot.ref.getDownloadURL().then(downloadUrl=>{
                setPatientPhoto(downloadUrl)}
                );
        })
    }
    
    return(
    <div className="Form">
        <div className="Form-head">
            <h2> Dar de alta  </h2>
        </div>
        {sendForm&&
        <div className="Form-sent">
            <span>Guardado con Exito!</span>
        </div>
        }
        {!sendForm&&
        <div className ="Form-item">
            <form onSubmit={handleSubmit}>
                <input name="firstName" type="text" placeholder="Nombre del paciente"/>
                <input name="lastName" type="text" placeholder="Apellido del paciente"/>
                <select name="type">
                    <option disable="true" value="seleccionar">Seleccionar</option>
                    <option value="Nino">Niño</option>
                    <option value="Adolescente">
                        Adolescente
                    </option>
                    <option value="Adulto">Adulto</option>
                </select>
                <select name="gender">
                    <option disable="true" value ="seleccionar">Seleccionar</option>
                    <option value="Hombre">Hombre</option>
                    <option value="Mujer">
                        Mujer
                    </option>
                </select>
                <input name="initialWeight" type="text" placeholder="Peso Inicial"/> 
                <input name="description" type="text" placeholder="Notas"/>
                <input type="file" name="photo" onChange={onChange}/>
                <button>Enviar</button>
            </form>
        </div>
        }
    </div>
);
}

const mapStateToProps = state =>{
    return{
        user: state.user,    }
}

export default connect(mapStateToProps)(Form);