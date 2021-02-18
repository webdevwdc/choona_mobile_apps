import { Alert, ToastAndroid } from 'react-native'
import Toast from 'react-native-simple-toast';



export default function showErrorAlert(title, message) {

    if (Platform.OS == "android") {
      ToastAndroid.show(message, ToastAndroid.LONG);
    } else {
      // Alert.alert(title, message, { text: 'OK', onPress: () => { } }, { cancelable: true })
     Toast.show(message,Toast.LONG)
    }
  }