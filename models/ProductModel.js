import Global from '../Global';
import axios from 'axios';
export default class ProductModel extends Global {
    async getProductBy(data) {
        return axios({
            method: 'post',
            url: '/product/index.php',
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