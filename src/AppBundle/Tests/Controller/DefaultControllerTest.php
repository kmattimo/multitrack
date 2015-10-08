<?php

namespace AppBundle\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use AppBundle\Entity\song;
use AppBundle\Entity\track;

use Doctrine;

class DefaultControllerTest extends WebTestCase
{
    public function testIndex()
    {
        // $client = static::createClient();
        // 
        // $crawler = $client->request('GET', '/app/example');
        // 
        // $this->assertEquals(200, $client->getResponse()->getStatusCode());
        // $this->assertTrue($crawler->filter('html:contains("Homepage")')->count() > 0);
        
        echo "HI";
        
        $songObject;
        
        echo "asdfff";
        $newSong = new song();
        $newSong->setUserid(0);
        echo "asdf";
        $newSong->setSongtitle("SDFLKSDF");


          $em = $this->getDoctrine()->getManager();
          $em->persist($newSong);
          $em->flush();
                
        
    }
}
