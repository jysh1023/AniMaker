import React, { useState, useEffect } from 'react';
import { Button, Image, View, Dimensions, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function AddDrawingScreen( {navigation} ) {
  const [image, setImage] = useState(null);

  const pickImage = async () => {

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePicture = async() => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing:true,
    });


    if (!result.canceled) {
      console.log(result);
      setImage(result.assets[0].uri);
    } else {
      alert('No image selected!')
    }
  }
  
  const handleSubmit = async() => {
    try {
      if (!image) {
        alert("Please select an image.");
        return;
      }
      console.log('서버에 이미지 요청을 보냅니다...');
      
      const formData = new FormData();
      formData.append('file', {
        uri: image,
        name: 'image.jpg',
        type: 'image/png', 
      });
  
      await axios.post("http://172.10.9.14:80/upload_image/", formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        }
      })
      .then(res => {
        console.log(res.data);
        alert('Image upload successful!');
        navigation.navigate('Edit Mask');
      })
      .catch(err => console.error(err));
      
    } catch (error) {
      alert('Error uploading image: ', error);
    }
  }
  return (
    <View style={styles.container}>
    <View style={styles.imageContainer}>
      {image && <Image source={{ uri: image }} style={styles.image} resizeMode="contain" />}
    </View>
    <View style={styles.buttonContainer}>
      <Button title="Gallery" onPress={pickImage} />
      <Button title="Camera" onPress={takePicture} />
    </View>
    <Button title="Upload" onPress={handleSubmit} />
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  imageContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width, // Display the image with its original width and height
    marginTop: 60,
  },
  image: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
  buttonContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
});