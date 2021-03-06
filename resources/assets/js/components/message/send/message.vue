<script>
    import axios from 'axios';
    import Lightbox from 'vue-simple-lightbox'

    export default {
        template: require('./message.html'),
        components: {
            Lightbox
        },
        data() {
            return {
                isMounted: false,
                message: "",
                upload_files: [],
                upload_files_extension: [],
                options: {
                    closeText: 'x'
                }
            }
        },

        mounted() {
            this.isMounted = true;
            let payload = this.$route.params.consult_id;
            this.$store.dispatch('getConsult', payload).then(
                response => {
                    this.fetchData(this.currentConsult.consult_id)
                    this.timer1 = setInterval(() => {
                        this.loadMessages(this.currentConsult.consult_id)
                        if (!this.isMounted) {
                            clearInterval(this.timer1);
                        }
                    }, 3000);
                    this.timer2 = setInterval(() => {
                        this.loadAttachments(this.currentConsult.consult_id)
                        if (!this.isMounted) {
                            clearInterval(this.timer2);
                        }
                    }, 7000);
                }
            );
        },

        beforeDestroy() {
            console.log('unmounted');
            this.isMounted = false;
        },

        methods: {
            isDraft() {
                if (this.currentConsult.status == 'draft') return true;
                return false;
            },
            isPending() {
                if (this.currentConsult.status == 'pending') return true;
                return false;
            },
            isDone() {
                if (this.currentConsult.status == 'done') return true;
                return false;
            },
            isImage(attachment) {
                if (attachment.type == 'image') return true;
                return false;
            },
            fetchData(consult_id) {
                console.log('FETCHED');
                this.loadMessages(consult_id);
                this.loadAttachments(consult_id);
            },
            loadMessages(consult_id) {
                this.$store.dispatch('getConsultMessages', consult_id).then(
                    response => {
                    }
                );
            },
            loadAttachments(consult_id) {
                this.$store.dispatch('getConsultAttachments', consult_id).then(
                    response => {
                    }
                );
            },
            isSelf(user_id) {
                if (user_id == this.currentUser.user_id) return true;
                return false;
            },
            onFilesChange(e) {
                this.upload_files = [];
                this.upload_files_extension = [];
                let files = e.target.files || e.dataTransfer.files;
                if (!files.length)
                    return;
                for (var i = 0; i < files.length; i++) {
                    // console.log(this.getBase64(files[i]))
                    // this.upload_files.push(this.getBase64(files[i]));
                    this.getBase64(files[i]).then(
                        data => {
                            this.upload_files.push(data);
                        }
                    );
                    this.upload_files_extension.push(files[i].name.split('.').pop());
                }
                console.log(this.upload_files)
            },
            getBase64(file) {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = error => reject(error);
                });
            },
            uploadFiles() {
                let payload = {
                    consult_id: this.currentConsult.consult_id,
                    files: this.upload_files,
                    files_type: this.upload_files_extension
                }
                this.$store.dispatch('postSendAttachments', payload).then(
                    response => {
                        this.upload_files = []
                    }
                );
            },
            sendMessage() {
                console.log('sendMessage: clicked');
                let payload = {
                    consult_id: this.currentConsult.consult_id,
                    message: this.message
                }
                console.log(payload);
                this.$store.dispatch('postSendMessage', payload).then(
                    response => {
                        // if success
                        this.message = '';
                        this.loadMessages(this.currentConsult.consult_id);
                    }
                );
            },
            downloadAttachment(attachment_id) {
                setTimeout(() => {
                    axios.get("/messages/download/" + attachment_id + "/?token=" + localStorage.getItem('token'))
                        .then(
                            response => {
                                let link = document.createElement('a');
                                link.href = response.data.file_link;
                                link.download = response.data.file_name;
                                link.target = '_blank';
                                link.click();
                                console.log(response);
                            }
                        ).catch(
                        error => {
                            console.log(error);
                        }
                    );
                }, 3000);
            },
            image_path(file_name) {
                return "../../storage/attachments/" + this.currentConsult.consult_id + "/" + file_name;
            },
            lightbox_image(file_name){
                return [
                    {
                        src: this.image_path(file_name)
                    }
                ]
            }
        },

        computed: {
            currentUser() {
                return this.$store.getters['currentUser'];
            },
            currentConsult() {
                return this.$store.getters['currentConsult'];
            },
            messages() {
                return this.$store.getters['currentConsultMessages'];
            },
            attachments() {
                return this.$store.getters['currentConsultAttachments'];
            },
        },
    }
</script>
<style scoped>
    .my-gallery a img{
        width: 100%;
    }

    #message {
        overflow: hidden;
    }

    .crop {
        margin-right: 1%;
    }

    .vertical-divider {
        border-left: 2px solid #F8F8F8;
        max-height: 100%;
        margin-top: 20px;
        margin-bottom: 20px;
    }

    .upload {
        margin-top: 30px;
    }

    .scrollbox {
        overflow: auto;
        max-height: 80vh;
    }

    .column-2 {
        height: -webkit-fill-available;
        border: 1px solid lightgray;
        border-top: none;
    }

    .sendMessage-wrap {
        border: 1px solid lightgray;
        border-top: none;
    }

    html, body {
        background: #e5e5e5;
        font-family: 'Lato', sans-serif;
        margin: 0px auto;
    }

    ::selection {
        background: rgba(82, 179, 217, 0.3);
        color: inherit;
    }

    a {
        color: rgba(82, 179, 217, 0.9);
    }

    /* M E N U */

    .menu {
        position: fixed;
        top: 0px;
        left: 0px;
        right: 0px;
        width: 100%;
        height: 50px;
        background: rgba(82, 179, 217, 0.9);
        z-index: 100;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
    }

    .back {
        position: absolute;
        width: 90px;
        height: 50px;
        top: 0px;
        left: 0px;
        color: #fff;
        line-height: 50px;
        font-size: 30px;
        padding-left: 10px;
        cursor: pointer;
    }

    .back img {
        position: absolute;
        top: 5px;
        left: 30px;
        width: 40px;
        height: 40px;
        background-color: rgba(255, 255, 255, 0.98);
        border-radius: 100%;
        -webkit-border-radius: 100%;
        -moz-border-radius: 100%;
        -ms-border-radius: 100%;
        margin-left: 15px;
    }

    .back:active {
        background: rgba(255, 255, 255, 0.2);
    }

    .name {
        position: absolute;
        top: 3px;
        left: 110px;
        font-family: 'Lato';
        font-size: 25px;
        font-weight: 300;
        color: rgba(255, 255, 255, 0.98);
        cursor: default;
    }

    .last {
        position: absolute;
        top: 30px;
        left: 115px;
        font-family: 'Lato';
        font-size: 11px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.6);
        cursor: default;
    }

    /* M E S S A G E S */

    .chat {
        list-style: none;
        background: none;
        margin: 0;
        padding: 0 0 50px 0;
        margin-top: 30px;
        margin-bottom: 20px;
    }

    .chat li {
        padding: 0.5rem;
        overflow: hidden;
        display: flex;
    }

    .chat .avatar {
        width: 40px;
        height: 40px;
        position: relative;
        display: block;
        z-index: 2;
        border-radius: 100%;
        -webkit-border-radius: 100%;
        -moz-border-radius: 100%;
        -ms-border-radius: 100%;
        background-color: rgba(255, 255, 255, 0.9);
    }

    .chat .avatar img {
        width: 40px;
        height: 40px;
        border-radius: 100%;
        -webkit-border-radius: 100%;
        -moz-border-radius: 100%;
        -ms-border-radius: 100%;
        background-color: rgba(255, 255, 255, 0.9);
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
    }

    .chat .day {
        position: relative;
        display: block;
        text-align: center;
        color: #c0c0c0;
        height: 20px;
        text-shadow: 7px 0px 0px #e5e5e5, 6px 0px 0px #e5e5e5, 5px 0px 0px #e5e5e5, 4px 0px 0px #e5e5e5, 3px 0px 0px #e5e5e5, 2px 0px 0px #e5e5e5, 1px 0px 0px #e5e5e5, 1px 0px 0px #e5e5e5, 0px 0px 0px #e5e5e5, -1px 0px 0px #e5e5e5, -2px 0px 0px #e5e5e5, -3px 0px 0px #e5e5e5, -4px 0px 0px #e5e5e5, -5px 0px 0px #e5e5e5, -6px 0px 0px #e5e5e5, -7px 0px 0px #e5e5e5;
        box-shadow: inset 20px 0px 0px #e5e5e5, inset -20px 0px 0px #e5e5e5, inset 0px -2px 0px #d7d7d7;
        line-height: 38px;
        margin-top: 5px;
        margin-bottom: 20px;
        cursor: default;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
    }

    .other .msg {
        order: 1;
        border-top-left-radius: 0px;
        box-shadow: -1px 2px 0px #D4D4D4;
    }

    .other:before {
        content: "";
        position: relative;
        top: 0px;
        right: 0px;
        left: 40px;
        width: 0px;
        height: 0px;
        border: 5px solid #fff;
        border-left-color: transparent;
        border-bottom-color: transparent;
    }

    .self {
        justify-content: flex-end;
        align-items: flex-end;
    }

    .self .msg {
        order: 1;
        border-bottom-right-radius: 0px;
        box-shadow: 1px 2px 0px #D4D4D4;
    }

    .self .avatar {
        order: 2;
    }

    .self .avatar:after {
        content: "";
        position: relative;
        display: inline-block;
        bottom: 19px;
        right: 0px;
        width: 0px;
        height: 0px;
        border: 5px solid #fff;
        border-right-color: transparent;
        border-top-color: transparent;
        box-shadow: 0px 2px 0px #D4D4D4;
    }

    .msg {
        background: white;
        min-width: 50px;
        padding: 10px;
        border-radius: 2px;
        box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.07);
        max-width: 300px;
        word-wrap: break-word;
    }

    .msg p {
        font-size: 0.8rem;
        margin: 0 0 0.2rem 0;
        color: #777;
    }

    .msg img {
        position: relative;
        display: block;
        width: 450px;
        border-radius: 5px;
        box-shadow: 0px 0px 3px #eee;
        transition: all .4s cubic-bezier(0.565, -0.260, 0.255, 1.410);
        cursor: default;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
    }

    @media screen and (max-width: 800px) {
        .msg img {
            width: 300px;
        }
    }

    @media screen and (max-width: 550px) {
        .msg img {
            width: 200px;
        }
    }

    .msg time {
        font-size: 0.7rem;
        color: #ccc;
        margin-top: 3px;
        float: right;
        cursor: default;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
    }

    .msg time:before {
        content: "\f017";
        color: #ddd;
        font-family: FontAwesome;
        display: inline-block;
        margin-right: 4px;
    }

    ::-webkit-scrollbar {
        min-width: 12px;
        width: 12px;
        max-width: 12px;
        min-height: 12px;
        height: 12px;
        max-height: 12px;
        background: #e5e5e5;
        box-shadow: inset 0px 50px 0px rgba(82, 179, 217, 0.9), inset 0px -52px 0px #fafafa;
    }

    ::-webkit-scrollbar-thumb {
        background: #bbb;
        border: none;
        border-radius: 100px;
        border: solid 3px #e5e5e5;
        box-shadow: inset 0px 0px 3px #999;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: #b0b0b0;
        box-shadow: inset 0px 0px 3px #888;
    }

    ::-webkit-scrollbar-thumb:active {
        background: #aaa;
        box-shadow: inset 0px 0px 3px #7f7f7f;
    }

    ::-webkit-scrollbar-button {
        display: block;
        height: 26px;
    }

    /* T Y P E */

    chatbox {
        position: fixed;
        bottom: 0px;
        left: 0px;
        right: 0px;
        width: 100%;
        height: 50px;
        z-index: 99;
        background: #c0c0c0;
        border: none;
        outline: none;
        padding-left: 55px;
        padding-right: 55px;
        color: #666;
        font-weight: 400;
        font-size: 15px;
    }

    @media only screen and (max-width: 360px) {
        #message-box {
            max-width: 185px;
        }
    }

    @media only screen and (max-width: 567px) and (min-width: 361px) {
        #message-box {
            max-width: 70%;
        }
    }

    @media only screen and (max-width: 767px) and (min-width: 568px) {
        #message-box {
            max-width: 220px;
        }
    }

    @media only screen and (max-width: 812px) and (min-width: 768px) {
        #message-box {
            max-width: 85%;
        }
    }

    @media only screen and (min-width: 813px) and (max-width: 1024px) {
        #message-box {
            max-width: 300px;
        }
    }

    @media only screen and (min-width: 1025px) {
        #message-box {
            max-width: 500px;
        }
    }

    #send-btn {
        margin-top: 7px;
    }
</style>
