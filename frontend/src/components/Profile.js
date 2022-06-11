/* Importation des composants */
import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation, NavLink } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";

import TimeAgo from 'timeago-react';
import * as timeago from 'timeago.js';
import fr from 'timeago.js/lib/lang/fr';
timeago.register('fr', fr);


const Dashboard = () => {
    const [isAdmin, setAdmin] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [user, setUser] = useState([]);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const navigate = useNavigate();

    const { id } = useParams();
    const location = useLocation()

    useEffect(() => {
        refreshToken();
        getUser();
        getMyPosts();
        getComByUser();
    }, [location.key]);

    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:5000/users/token');
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setAdmin(decoded.isAdmin);
            setExpire(decoded.exp);
        } catch (error) {
            if (error.response) {
                navigate("/", { replace: true });
            }
        }
    }

    const axiosJWT = axios.create();

    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()) {
            const response = await axios.get('http://localhost:5000/users/token');
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setAdmin(decoded.isAdmin);
            setExpire(decoded.exp);
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    // Fonction pour récupérer tous les posts 
    const getMyPosts = async () => {
        const response = await axiosJWT.get(`http://localhost:5000/posts/user/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setPosts(response.data);
    }

    // Fonction pour récupérer les posts par l'utilisateur
    const getUser = async () => {
        const response = await axiosJWT.get(`http://localhost:5000/users/id/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setUser(response.data);
    }

    // Fonction de suppression d'un post
    const deletePost = async (postId) => {
        try {
            if (window.confirm("Voulez-vous vraiment supprimer ce message ?")) {
                await axios.delete(`http://localhost:5000/posts/id/${postId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // navigate("/profile", { replace: true }); 
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Fonction de suppression d'un utilisateur
    const delUser = async (userId) => {
        try {
            if (window.confirm("Voulez-vous vraiment supprimer ce compte ?")) {
                await axios.delete(`http://localhost:5000/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                navigate("/home", { replace: true });
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Fonction de récupération des commentaires par l'utilisateur
    const getComByUser = async () => {
        const response = await axiosJWT.get(`http://localhost:5000/comments/user/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setComments(response.data);
    }

    // Fonction TimeAgo
    const LastSeen = (date) => {
        return (<TimeAgo datetime={date} locale='fr' />);
    }

    return (
        <>
            <section className="mesInfos">
                <div className={user.isAdmin == 1 ? ("card mb-5 has-background-danger-light") : ("card mb-5 has-background-info-light")}>
                    <div className="card-content">
                        <div className="media">
                            <div className="media-left">
                                <figure className="image is-48x48">
                                    <img className="userImg is-rounded" src={'../images/profilepictures/' + user.userImg} alt='pp' />
                                </figure>
                            </div>
                            <div className="media-content">
                                <p className={user.isAdmin == 1 ? ("title is-size-6 has-text-danger-dark mb-2") : ("title is-size-6 has-text-info-dark mb-2")}>
                                    {user.prenom} {user.nom}<span className="has-text-grey has-text-weight-light ml-1">{user.email}</span>
                                </p>
                                <p className="is-italic is-size-7 has-text-grey mb-2"> A rejoint l'équipe {LastSeen(user.createdAt)}</p>
                                <p className="is-italic is-size-7 has-text-grey mb-2">{posts.length == 0 ? ("N'a publié aucun message") : (
                                    posts.length == 1 ? ('A publié ' + posts.length + ' message') : ('A publié ' + posts.length + ' messages')
                                )}
                                </p>
                                <p className="is-italic is-size-7 has-text-grey">{comments.length == 0 ? ("N'a publié aucun commentaire") : (
                                    comments.length == 1 ? ('A publié ' + comments.length + ' commentaire') : ('A publié ' + comments.length + ' commentaires')
                                )}
                                </p>
                            </div>
                        </div>
                        {isAdmin == 1 ? (
                            <div className="content pb-5">
                                <button type='button' className="button is-pulled-right is-danger is-outlined" onClick={() => { delUser(user.id) }}>Supprimer</button>
                            </div>
                        ) : ('')}
                    </div>
                </div>
            </section>

            <section className="tousLesMessages">
                {posts.slice(0).reverse().map((post, index) => {
                    return (
                        <div key={index} className="card mb-5">
                            <div className="card-content">
                                <div className="media">
                                    <div className="media-left">
                                        <figure className="image is-48x48">
                                            <img className="userImg is-rounded" src={'../images/profilepictures/' + post.user.userImg} alt='pp' />
                                        </figure>
                                    </div>
                                    <div className="media-content">
                                        <p className={post.user.isAdmin == 1 ? ("title is-size-6 has-text-danger-dark mb-5") : ("title is-size-6 has-text-info-dark mb-5")}>
                                            {post.user.prenom} {post.user.nom} <span className="has-text-grey has-text-weight-light">{post.user.email}</span>
                                        </p>
                                        <p className="subtitle is-size-7 has-text-grey">{LastSeen(post.createdAt)}</p>
                                    </div>
                                </div>
                                <div className="content">
                                    <p>{post.postMsg}</p>
                                    {post.comments.length == 0 ? (<NavLink to={'../post/' + post.id} className="button is-small is-link is-light">Commenter</NavLink>)
                                        : (post.comments.length == 1 ?
                                            (<NavLink to={'../post/' + post.id} className="button is-small is-link is-light"><span className="has-text-weight-bold mr-1">{post.comments.length}</span>commentaire</NavLink>)
                                            : (<NavLink to={'../post/' + post.id} className="button is-small is-link is-light"><span className="has-text-weight-bold mr-1">{post.comments.length}</span>commentaires</NavLink>)
                                        )}
                                    {isAdmin == 1 ? (<button type='button' className="button is-pulled-right is-danger is-outlined" onClick={() => { deletePost(post.id) }}>Supprimer</button>) : ('')}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </section>
        </>
    );
}

export default Dashboard