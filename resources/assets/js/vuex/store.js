import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        isLoggedIn: null,
        user: null,
        account: null,
        allUsers: null,
        currentViewUser: null,
        consultDraft: null,
        consultPending: null,
        consultDone: null,
        consultSearch: null,
        currentConsult: null,
        currentConsultMessages: null,
        currentConsultAttachments: null,
    },
    getters: {
        isLoggedIn(state) {
            return state.isLoggedIn;
        },
        currentUser(state) {
            return state.user;
        },
        userRole(state) {
            return state.account.role;
        },
        allUsers(state) {
            return state.allUsers;
        },
        currentViewUser(state) {
            return state.currentViewUser.user;
        },
        currentViewRole(state) {
            return state.currentViewUser.role;
        },
        consultDraftList(state) {
            return state.consultDraft;
        },
        consultPendingList(state) {
            return state.consultPending;
        },
        consultDoneList(state) {
            return state.consultDone;
        },
        currentConsult(state) {
            return state.currentConsult;
        },
        currentConsultMessages(state) {
            return state.currentConsultMessages;
        },
        currentConsultAttachments(state) {
            return state.currentConsultAttachments;
        }
    },
    mutations: {
        initialiseStore(state) {
            state.isLoggedIn = false;
            state.user = {};
            state.account = {};
            state.allUsers = {};
            state.currentViewUser = {};
            console.log("initialiseStore");
        },
        setUser(state, user) {
            state.user = user;
        },
        setAccount(state, account) {
            state.account = account;
        },
        updateIsLoggedIn(state) {
            state.isLoggedIn = !!localStorage.getItem('token');
        },
        clearUser(state) {
            state.user = {};
        },
        setAllUsers(state, users) {
            state.allUsers = users;
        },
        setCurrentViewUser(state, user) {
            state.currentViewUser = user;
        },
        setCurrentViewUserRole(state, user) {
            state.currentViewUser = user;
        },
        setDraftConsults(state, consults) {
            state.consultDraft = consults;
        },
        setPendingConsults(state, consults) {
            state.consultPending = consults;
        },
        setDoneConsults(state, consults) {
            state.consultDone = consults;
        },
        setCurrentConsult(state, consult) {
            state.currentConsult = consult;
        },
        setCurrentConsultMessages(state, messages) {
            state.currentConsultMessages = messages;
        },
        setCurrentConsultAttachments(state, attachments) {
            state.currentConsultAttachments = attachments;
        },
    },
    actions: {
        init({commit}) {
            commit('initialiseStore');
        },

        onRefresh({commit}) {
            if (!localStorage.getItem('token') || localStorage.getItem('token') == "") {
                console.log("No Token in localStorage");
            } else {
                console.log("Token in localStorage");
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        axios.get("/auth/refresh?token=" + localStorage.getItem('token'))
                            .then(
                                response => {
                                    // console.log(response)
                                    this.dispatch('setUser', response.data.user);
                                    this.dispatch('setAccount', response.data.account);
                                    this.dispatch('updateIsLoggedIn');
                                    console.log("Token verified");
                                    resolve(response);
                                }
                            ).catch(
                            error => {
                                console.log(error);
                                reject(error);
                            }
                        );
                    }, 1000);
                });
            }
        },

        updateIsLoggedIn({commit}) {
            commit('updateIsLoggedIn')
        },

        setUser({commit}, user) {
            commit('setUser', user)
        },

        setAccount({commit}, account) {
            commit('setAccount', account)
        },

        login({commit}, {username, password}) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    axios.post("/auth/login",
                        {
                            username: username,
                            password: password
                        },
                        {
                            headers: {'Content-Type': 'application/json'}
                        }
                    ).then(response => {
                            // console.log(response)
                            localStorage.setItem("token", response.data.token);
                            this.dispatch('setUser', response.data.user);
                            this.dispatch('setAccount', response.data.account);
                            this.dispatch('updateIsLoggedIn');
                            console.log(response);
                            resolve(response);
                        }
                    ).catch(error => {
                            console.log(error);
                            reject(error);
                        }
                    );
                }, 1000);
            });
        },

        logout({commit}) {
            localStorage.removeItem("token");
            commit('updateIsLoggedIn');
            commit('clearUser');
        },

        addUser({commit}, user) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    axios.post("/users/add?token=" + localStorage.getItem('token'), user,
                        {
                            headers: {'Content-Type': 'application/json'}
                        }
                    ).then(response => {
                            // console.log(response)
                            // alert("Create success VUEX");
                            console.log(response);
                            resolve(response);
                        }
                    ).catch(error => {
                            // alert("Create success VUEX");
                            console.log(error);
                            reject(error);
                        }
                    );
                }, 1000)
            });
        },

        updateUser({commit}, user) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    axios.post("/users/update?token=" + localStorage.getItem('token'), user,
                        {
                            headers: {'Content-Type': 'application/json'}
                        }
                    ).then(response => {
                            // console.log(response)
                            // alert("Create success VUEX");
                            console.log(response);
                            resolve(response);
                        }
                    ).catch(error => {
                            // alert("Create success VUEX");
                            console.log(error);
                            reject(error);
                        }
                    );
                }, 1000)
            });
        },

        getAllUsers({commit}) {
            if (!localStorage.getItem('token') || localStorage.getItem('token') == "") {
                console.log("No Token in localStorage");
            } else {
                console.log("Token in localStorage");
                return new Promise(resolve => {
                    setTimeout(() => {
                        axios.get("/users?token=" + localStorage.getItem('token'))
                            .then(
                                response => {
                                    console.log(response);
                                    commit('setAllUsers', response.data.users);
                                    console.log("All users GET");
                                }
                            ).catch(
                            error => {
                                console.log(error);
                                resolve(error);
                            }
                        );
                    }, 1000);
                });
            }
        },

        getSearch({commit}, keyword) {
            if (!localStorage.getItem('token') || localStorage.getItem('token') == "") {
                console.log("No Token in localStorage");
            } else {
                console.log("Token in localStorage");
                return new Promise(resolve => {
                    setTimeout(() => {
                        axios.post("/users/search?token=" + localStorage.getItem('token'), {
                            'keyword': keyword
                        })
                            .then(
                                response => {
                                    console.log(response);
                                    commit('setAllUsers', response.data.users);
                                    console.log("All users GET");
                                }
                            ).catch(
                            error => {
                                console.log(error);
                                resolve(error);
                            }
                        );
                    }, 1000);
                });
            }
        },

        getUser({commit}, user_id) {
            if (!localStorage.getItem('token') || localStorage.getItem('token') == "") {
                console.log("No Token in localStorage");
            } else {
                console.log("Token in localStorage");
                return new Promise(resolve => {
                    setTimeout(() => {
                        axios.get("/users/" + user_id + "?token=" + localStorage.getItem('token'))
                            .then(
                                response => {
                                    console.log(response);
                                    commit('setCurrentViewUser', response.data.user);
                                    console.log("GET user by id");
                                    resolve(response);
                                }
                            ).catch(
                            error => {
                                console.log(error);
                                resolve(error);
                            }
                        );
                    }, 1000);
                });
            }
        },

        getDelete({commit}, user_id) {
            if (!localStorage.getItem('token') || localStorage.getItem('token') == "") {
                console.log("No Token in localStorage");
            } else {
                console.log("Token in localStorage");
                return new Promise(resolve => {
                    setTimeout(() => {
                        axios.get("/users/delete/" + user_id + "?token=" + localStorage.getItem('token'))
                            .then(
                                response => {
                                    console.log(response);
                                    commit('setCurrentViewUser', response.data.user);
                                    alert('Succeeded')
                                }
                            ).catch(
                            error => {
                                console.log(error);
                                resolve(error);
                            }
                        );
                    }, 1000);
                });
            }
        },

        sendRequest({commit}, email) {
            console.log(email);
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    axios.post("/auth/password/request", {'email': email})
                        .then(
                            response => {
                                console.log(response);
                                // commit('setCurrentViewUser', response.data.user);
                                resolve(response);
                            }
                        ).catch(
                        error => {
                            console.log(error);
                            reject(error);
                        }
                    );
                }, 1000);
            });
        },

        updatePassword({commit}, payload) {
            // console.log(email);
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    axios.post("/auth/password/reset", payload)
                        .then(
                            response => {
                                console.log(response);
                                // commit('setCurrentViewUser', response.data.user);
                                resolve(response);
                            }
                        ).catch(
                        error => {
                            console.log(error);
                            reject(error);
                        }
                    );
                }, 1000);
            });
        },

        getAllConsults({commit, state}) {
            if (!localStorage.getItem('token') || localStorage.getItem('token') == "") {
                console.log("No Token in localStorage");
            } else {
                console.log("Token in localStorage");
                return new Promise(resolve => {
                    setTimeout(() => {
                        axios.get("/consults/draft/" + state.user.user_id + "?token=" + localStorage.getItem('token'))
                            .then(
                                response => {
                                    console.log(response);
                                    commit('setDraftConsults', response.data.consults);
                                    console.log("Draft consults GET");
                                }
                            ).catch(
                            error => {
                                console.log(error);
                                resolve(error);
                            }
                        );
                        axios.get("/consults/pending/?token=" + localStorage.getItem('token'))
                            .then(
                                response => {
                                    console.log(response);
                                    commit('setPendingConsults', response.data.consults);
                                    console.log("Pending consults GET");
                                }
                            ).catch(
                            error => {
                                console.log(error);
                                resolve(error);
                            }
                        );
                        axios.get("/consults/done/?token=" + localStorage.getItem('token'))
                            .then(
                                response => {
                                    console.log(response);
                                    commit('setDoneConsults', response.data.consults);
                                    console.log("Done consults GET");
                                }
                            ).catch(
                            error => {
                                console.log(error);
                                resolve(error);
                            }
                        );
                    }, 2000);
                });
            }
        },

        saveConsult({commit}, payload) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    axios.post("/consults/?token=" + localStorage.getItem('token'), payload)
                        .then(
                            response => {
                                console.log(response);
                                // commit('setCurrentConsult', response.data.consult);
                                resolve(response);
                            }
                        ).catch(
                        error => {
                            console.log(error);
                            reject(error);
                        }
                    );
                }, 1000);
            });
        },

        editConsult({commit}, payload) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log("Edit Consult id = " + payload.consult_id);
                    console.log(payload.consult)
                    axios.post("/consults/" + payload.consult_id + "?token=" + localStorage.getItem('token'), payload.consult)
                        .then(
                            response => {
                                console.log(response);
                                // commit('setCurrentConsult', response.data.consult);
                                resolve(response);
                            }
                        ).catch(
                        error => {
                            console.log(error);
                            reject(error);
                        }
                    );
                }, 1000);
            });
        },

        getConsult({commit}, consult_id) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    axios.get("/consults/" + consult_id + "/?token=" + localStorage.getItem('token'))
                        .then(
                            response => {
                                console.log(response);
                                commit('setCurrentConsult', response.data.consult);
                                resolve(response);
                            }
                        ).catch(
                        error => {
                            console.log(error);
                            reject(error);
                        }
                    );
                }, 1000);
            });
        },

        getDeleteConsult({commit}, consult_id) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    axios.get("/consults/" + consult_id + "/delete/?token=" + localStorage.getItem('token'))
                        .then(
                            response => {
                                console.log(response);
                                // commit('setCurrentConsult', response.data.message);
                                resolve(response);
                            }
                        ).catch(
                        error => {
                            console.log(error);
                            reject(error);
                        }
                    );
                }, 1000);
            });
        },

        getSendConsult({commit}, consult_id) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log("/consults/" + consult_id + "/send/?token=" + localStorage.getItem('token'))
                    axios.get("/consults/" + consult_id + "/send?token=" + localStorage.getItem('token'))
                        .then(
                            response => {
                                console.log(response);
                                // commit('setCurrentConsult', response.data.message);
                                resolve(response);
                            }
                        ).catch(
                        error => {
                            console.log(error);
                            reject(error);
                        }
                    );
                }, 1000);
            });
        },

        postSearchConsult({commit}, keyword) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    axios.post("/consults/search/?token=" + localStorage.getItem('token'), {
                        'keyword': keyword
                    })
                        .then(
                            response => {
                                console.log(response);
                                commit('setDoneConsults', response.data.consults);
                                resolve(response);
                            }
                        ).catch(
                        error => {
                            console.log(error);
                            reject(error);
                        }
                    );
                }, 1000);
            });
        },

        postReplyConsult({commit}, payload) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    axios.post("/consults/" + payload.consult_id + "/reply/?token=" + localStorage.getItem('token'), {
                        'consult_order': payload.consult_order
                    })
                        .then(
                            response => {
                                console.log(response);
                                commit('setDoneConsults', response.data.consults);
                                resolve(response);
                            }
                        ).catch(
                        error => {
                            console.log(error);
                            reject(error);
                        }
                    );
                }, 1000);
            });
        },

        getConsultMessages({commit}, consult_id) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    axios.get("/messages/" + consult_id + "/?token=" + localStorage.getItem('token'))
                        .then(
                            response => {
                                console.log(response);
                                commit('setCurrentConsultMessages', response.data.messages);
                                resolve(response);
                            }
                        ).catch(
                        error => {
                            console.log(error);
                            reject(error);
                        }
                    );
                }, 1000);
            });
        },

        getConsultAttachments({commit}, consult_id) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    axios.get("/messages/" + consult_id + "/attachments/?token=" + localStorage.getItem('token'))
                        .then(
                            response => {
                                console.log(response);
                                commit('setCurrentConsultAttachments', response.data.attachments);
                                resolve(response);
                            }
                        ).catch(
                        error => {
                            console.log(error);
                            reject(error);
                        }
                    );
                }, 1000);
            });
        },

        postSendAttachments({commit}, payload) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    axios.post("/messages/" + payload.consult_id + "/attachments/?token=" + localStorage.getItem('token'), {
                        'attachments': payload.files,
                        'attachments_type': payload.files_type
                    })
                        .then(
                            response => {
                                console.log(response);
                                // commit('setDoneConsults', response.data.consults);
                                resolve(response);
                            }
                        ).catch(
                        error => {
                            console.log(error);
                            reject(error);
                        }
                    );
                }, 1000);
            });
        },

        postSendMessage({commit}, payload) {
            console.log('postSendMessage: called');
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    axios.post("/messages/" + payload.consult_id + "/?token=" + localStorage.getItem('token'), {
                        'message': payload.message
                    })
                        .then(
                            response => {
                                console.log(response);
                                // commit('setDoneConsults', response.data.consults);
                                resolve(response);
                            }
                        ).catch(
                        error => {
                            console.log(error);
                            reject(error);
                        }
                    );
                }, 1000);
            });
        },

        getPrintConsult({commit}, consult_id) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    axios.get("/consults/" + consult_id + "/print/?token=" + localStorage.getItem('token'))
                        .then(
                            response => {
                                // console.log(response);
                                resolve(response);
                            }
                        ).catch(
                        error => {
                            console.log(error);
                            reject(error);
                        }
                    );
                }, 1000);
            });
        },

    },
});