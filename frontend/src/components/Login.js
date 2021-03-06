/* Importation des composants */
import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Fonction Login
const Login = () => {
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    const initialValues = {
        email: "",
        password: ""
    };
    // Schema de validation
    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Veuillez entrer une adresse email valide").required("Veuillez entrer votre adresse email"),
        password: Yup.string().required("Veuillez entrer un mot de passe")
    });

    // Fonction de connexion
    const onSubmit = async (data) => {
        try {
            await axios.post('http://localhost:5000/users/login', data);
            navigate("/home", { replace: true });
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };

    return (
        <>
            <div className="message is-dark">
                <h2 className="message-header  has-background-danger">Se connecter</h2>
                <div className="message-body">
                    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                        <Form>
                            {msg ? (<p className="notification is-danger is-size-6 p-2 mt-1">{msg}</p>) : ("")}
                            <div className="field">
                                <label htmlFor='email' className="label">Email:</label>
                                <div className="controls">
                                    <Field name="email" type="text" placeholder="Email" autoComplete="off" className="input is-rounded is-danger"></Field>
                                </div>
                                <ErrorMessage name="email" component="p" className="notification is-danger is-light p-2 mt-1" />
                            </div>
                            <div className="field">
                                <label htmlFor='password' className="label">Mot de passe:</label>
                                <div className="controls">
                                    <Field name="password" type="password" placeholder="******" autoComplete="off" className="input is-rounded is-danger"></Field>
                                </div>
                                <ErrorMessage name="password" component="p" className="notification is-danger is-light p-2 mt-1" />
                            </div>
                            <button type='submit' className="button is-danger is-outlined mt-2">Connexion</button>
                        </Form>
                    </Formik>
                </div>
            </div>
        </>
    )
};

export default Login