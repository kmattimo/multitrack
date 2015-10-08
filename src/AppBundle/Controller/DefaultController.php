<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

use AppBundle\Entity\song;
use AppBundle\Entity\track;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction()
    {
	    $songs = $this->getDoctrine()
        ->getRepository('AppBundle:song')
        ->findAll(0);

    if (!$songs) {
        //throw $this->createNotFoundException(
		//todo: not really an exception just need to handle there being no songs
		echo "No Songs";
    }
        return $this->render('default/index.html.twig',
			array('songs' => $songs)
		);
    }

    /**
     * @Route("/song/{id}", name="song")
     */	
	public function songAction($id)
	{
	$song = $this->getDoctrine()
        ->getRepository('AppBundle:song')
        ->find($id);
	$tracks = $this->getDoctrine()
        ->getRepository('AppBundle:track')
        ->findBysongid($id);
	return $this->render('default/song.html.twig',
			array('song' => $song, 'tracks' => $tracks )
		);
	}
	
	/**
     * @Route("/newsong", name="newsong")
     */	
	public function newSongAction()
	{
	return $this->render('default/newsong.html.twig' );
	}
	
	/**
     * @Route("/savesong", name="savesong")
     */
	public function saveSongAction()
	{
	//must wait until all files uploaded? 
	//can we assume this since songs are added on complete? 
	//it should work for benevolent users.... 
	$songObject = json_decode($_POST['json']);
//---transaction	
	//insert new song: [userid] songtitle
	$newSong = new song();
	$newSong->setUserid(0);
	$newSong->setSongtitle($songObject->songTitle);
	//var_dump($songObject);
	    $em = $this->getDoctrine()->getManager();
		$em->persist($newSong);
		$em->flush();
	$userID = $newSong->getUserid();

	//create ID+timestamp folder
	//todo: place for global strings in php? 
	//todo: song or user id? 
	//todo: change to directory separator
	$dirname = "upload/" . date("Y-m-d H.i.s") ."-". $userID ; 
	mkdir($dirname);
	
	//foeach track in song.... 
	foreach($songObject->queue as $key => $curTrack)
		{
		//check if file exists?
		//echo $curTrack->url;
		//move file
		$finalTrackURL = $dirname . "/". $key . $curTrack->url;
		rename("upload/temp/" . $curTrack->url , $finalTrackURL);
		//prepend folder to url 
		//insert new track: songid url tracktitle
		$newTrack = new track();
		$newTrack->setSongid( $newSong->getId());
		$newTrack->setUrl("/".$finalTrackURL);
		$newTrack->setTracktitle($curTrack->name);
		$em->persist($newTrack);
		$em->flush();
		}
//--- transaction	
	//return new Response('{}'); //$_POST['json']
	return new Response(json_encode($newSong->getId()));
	}
	
	/**
     * @Route("/upload", name="upload")
     */	
	public function uploadAction()
	{
	$ds = DIRECTORY_SEPARATOR;
	$storeFolder = 'upload' . $ds. 'temp';
	
	if (!empty($_FILES)) 
		{
		$tempFile = $_FILES['file']['tmp_name'];    
		$targetPath = dirname( "." ) . $ds. $storeFolder . $ds; 
		$targetFile =  $targetPath. $_FILES['file']['name'];  
		$targetDir = "/upload";
		move_uploaded_file($tempFile,$targetFile); 
     	}
	return new Response('uploaded');
	}
	
	/**
     * @Route("/delete/{id}", name="delete")
     */	
	public function deleteAction(song $song)
	{
		if($song)
			{
			//todo: permissions
			//delete files and folder
			$em = $this->getDoctrine()->getEntityManager();
			$em->remove($song);
			$em->flush();
			return new Response('deleted');
			}
		else
			{
			return new Response('does not exist');
			}
	}
  /**
     * @Route("/init", name="init")
   */	
  public function initAction()
  {
    $em = $this->getDoctrine()->getManager();
      
    $repository = $this->getDoctrine()->getRepository('AppBundle:song');
    $existingSongs = $repository->findBySongtitle("Hide and Seek (demo)");
    if($existingSongs) {
      foreach ($existingSongs as $song ) {
        $em->remove($song);
      }
    }
    
    
    $newSong = new song();
    $newSong->setUserid(0);
    $newSong->setSongtitle("Hide and Seek (demo)");  
      $em->persist($newSong);
      $em->flush();
    $songid = $newSong->getId();
    $newTrack = new track();
    $newTrack->setSongid($songid );
    $newTrack->setUrl("/example/HaS/01-Piano.mp3");
		$newTrack->setTracktitle("All Piano");
		$em->persist($newTrack);
    
    $newTrack2 = new track();
    $newTrack2->setSongid($songid );
    $newTrack2->setUrl("/example/HaS/02-Soprano.mp3");
    $newTrack2->setTracktitle("Soprano");
    $em->persist($newTrack2);
    
    $newTrack2 = new track();
    $newTrack2->setSongid($songid );
    $newTrack2->setUrl("/example/HaS/03-Alto.mp3");
    $newTrack2->setTracktitle("Alto");
    $em->persist($newTrack2);
    
    $newTrack2 = new track();
    $newTrack2->setSongid($songid );
    $newTrack2->setUrl("/example/HaS/04-Tenor.mp3");
    $newTrack2->setTracktitle("Tenor");
    $em->persist($newTrack2);
    
    $newTrack2 = new track();
    $newTrack2->setSongid($songid );
    $newTrack2->setUrl("/example/HaS/05-Bass.mp3");
    $newTrack2->setTracktitle("Bass");
    $em->persist($newTrack2);
    
      $em->flush();
    return new Response("ok");        
  }
	
}
