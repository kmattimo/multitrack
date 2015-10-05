<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * track
 *
 * @ORM\Table()
 * @ORM\Entity
 */
class track
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var integer
     *
     * @ORM\Column(name="songid", type="integer")
     */
    private $songid;

    /**
     * @var string
     *
     * @ORM\Column(name="url", type="text")
     */
    private $url;

    /**
     * @var string
     *
     * @ORM\Column(name="tracktitle", type="text")
     */
    private $tracktitle;


    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set songid
     *
     * @param integer $songid
     * @return track
     */
    public function setSongid($songid)
    {
        $this->songid = $songid;

        return $this;
    }

    /**
     * Get songid
     *
     * @return integer 
     */
    public function getSongid()
    {
        return $this->songid;
    }

    /**
     * Set url
     *
     * @param string $url
     * @return track
     */
    public function setUrl($url)
    {
        $this->url = $url;

        return $this;
    }

    /**
     * Get url
     *
     * @return string 
     */
    public function getUrl()
    {
        return $this->url;
    }

    /**
     * Set tracktitle
     *
     * @param string $tracktitle
     * @return track
     */
    public function setTracktitle($tracktitle)
    {
        $this->tracktitle = $tracktitle;

        return $this;
    }

    /**
     * Get tracktitle
     *
     * @return string 
     */
    public function getTracktitle()
    {
        return $this->tracktitle;
    }
}
