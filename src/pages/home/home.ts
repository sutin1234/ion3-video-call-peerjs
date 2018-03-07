import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { visitSiblingRenderNodes } from '@angular/core/src/view/util';

declare var Peer;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  myID: any;
  anotherID: any;
  peer: any;
  conn: any;
  videoCallButtonState: boolean;
  @ViewChild('myVideo') myVideo: any;

  constructor(public navCtrl: NavController) {


  }
  ionViewDidLoad(){
    this.peer = new Peer({key: 'lwjd5qra8257b9'});
    const video = this.myVideo.nativeElement;

    this.peer.on('open', function(id) {
      this.myID = id;
      console.log('My peer ID is: ' + id + ' generated');
    });
    /*
    this.peer.on('connection', function(conn) {
      conn.on('data', function(data){
        console.log('connection ' + data);
      });
    });
    */
    this.peer.on('call', function(call) {
      navigator.getUserMedia({video: true, audio: true}, function(stream) {
        call.answer(stream); // Answer the call with an A/V stream.
        call.on('stream', function(remoteStream) {
          console.log('stream answer ', remoteStream);
          video.src = URL.createObjectURL(remoteStream);
          video.play();
        });
      }, function(err) {
        console.log('Failed to get local stream' ,err);
      });
    });


  }
  connect(){
    var conn = this.peer.connect(this.anotherID);
    conn.on('open', function(){
      this.videoCallButtonState = true;
      conn.send('hi!');
    });
  }
  startVideoCall(){
    const anotherID = this.anotherID;
    const myPeer = this.peer;
    let videoEl = this.myVideo;
    const video = this.myVideo.nativeElement;

    navigator.getUserMedia({video: true, audio: true}, function(stream) {
      var call = myPeer.call(anotherID, stream);
      call.on('stream', function(remoteStream) {
        console.log(remoteStream);
        video.src = URL.createObjectURL(remoteStream);
        video.play();
      });
    }, function(err) {
      console.log('Failed to get local stream' ,err);
    });
  }

}
