import Global from '../Global';
import axios from 'axios';
export default class UserModel extends Global {
    async getUserLogin(data) {
        return axios({
            method: 'post',
            url: '/user/login/index.php',
            baseURL: this.getServerUrl(),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: data
        })
            .then(function (response) {
                return response.data
            })
            .catch(function (error) {
                console.log(error);
                return []
            });


    }

}