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
     * @Route("/songID/{id}", name="song",defaults={"slug"=null})
     * @Route("/song/{slug}", name="song2", defaults={"id"=null})
     */	
	public function songAction($id, $slug)
	{
    //seperate slug table or just another column in song? 
    $song = null;
    
    if($slug) {
      $song = $this->getDoctrine()
            ->getRepository('AppBundle:song')
            ->findOneBy(array('slug'=>$slug));
      if($song == null) {
        throw $this->createNotFoundException('The song ' .$slug . ' does not exist.');  
      }
      $id = $song->getId();
    }
    else {
      $song = $this->getDoctrine()
            ->getRepository('AppBundle:song')
            ->find($id);
    }
    if($song == null) {
      throw $this->createNotFoundException('The song id ' .$id . ' does not exist.');  
    }
    // return new response(print_r($song));
	
	$tracks = $this->getDoctrine()
        ->getRepository('AppBundle:track')
        ->findBysongid($id);
	return $this->render('default/song.html.twig',
			array('song' => $song, 'tracks' => $tracks, 'numTracks' => sizeof($tracks) )
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
	$songObject = json_decode($_POST['json']);
//---transaction	
	//insert new song: [userid] songtitle
	$newSong = new song();
	$newSong->setUserid(0);
	$newSong->setSongtitle($songObject->songTitle);
	  $em = $this->getDoctrine()->getManager();
		$em->persist($newSong);
		$em->flush();
	$userID = $newSong->getUserid();
	//foeach track in song.... 
	foreach($songObject->queue as $key => $curTrack)
		{
    //according to symfony/twig xss escaping is on by default?
		$finalTrackURL = $curTrack->url;
		//insert new track: songid url tracktitle
		$newTrack = new track();
		$newTrack->setSongid( $newSong->getId());
		$newTrack->setUrl($finalTrackURL);
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
    $existingSongs = $repository->findBySongtitle("Hallelujah (demo)");
    if($existingSongs) {
      foreach ($existingSongs as $song ) {
        $em->remove($song);
      }
    }
    $em->flush();
    
    $newSong = new song();
    $newSong->setUserid(0);
    $newSong->setSlug("HideAndSeek");
    $newSong->setSongtitle("Hide and Seek (demo)");  
      $em->persist($newSong);
      $em->flush();
    $songid = $newSong->getId();
    // $newTrack = new track();
    // $newTrack->setSongid($songid );
    // $newTrack->setUrl("/example/HaS/01-Piano.mp3");
		// $newTrack->setTracktitle("All Piano");
		// $em->persist($newTrack);
    
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
    
    $newSong2 = new song();
    $newSong2->setUserid(0);
    $newSong2->setSlug("hallelujah");
    $newSong2->setSongtitle("Hallelujah (demo)");  
      $em->persist($newSong2);
      $em->flush();
    $songid = $newSong2->getId();
    
    $newTrack2 = new track();
    $newTrack2->setSongid($songid );
    $newTrack2->setUrl("/example/beets/sop.mp3");
    $newTrack2->setTracktitle("Soprano");
    $em->persist($newTrack2);
    
    $newTrack2 = new track();
    $newTrack2->setSongid($songid );
    $newTrack2->setUrl("/example/beets/alto.mp3");
    $newTrack2->setTracktitle("Alto");
    $em->persist($newTrack2);
    
    $newTrack2 = new track();
    $newTrack2->setSongid($songid );
    $newTrack2->setUrl("/example/beets/tenor.mp3");
    $newTrack2->setTracktitle("Tenor");
    $em->persist($newTrack2);
    
    $newTrack2 = new track();
    $newTrack2->setSongid($songid );
    $newTrack2->setUrl("/example/beets/bass.mp3");
    $newTrack2->setTracktitle("Bass");
    $em->persist($newTrack2);  
    
    $em->flush();
    return new Response("ok");        
  }
	
}
