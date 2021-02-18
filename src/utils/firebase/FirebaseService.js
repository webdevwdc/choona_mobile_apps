import firebaseConfig from "./firebaseConfig";
import firebase from '@react-native-firebase/app';

let instance = null;

class FirebaseService {
    constructor() {
        if (!instance) {
            this.app = firebase.initializeApp(firebaseConfig);
            instance = this;
        }
        return instance;
    }
}

const firebaseService = new FirebaseService().app
export default firebaseService;