<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * song
 *
 * @ORM\Table()
 * @ORM\Entity
 */
class song
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
     * @ORM\Column(name="userid", type="integer")
     */
    private $userid;

    /**
     * @var string
     *
     * @ORM\Column(name="songtitle", type="text")
     */
    private $songtitle;


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
     * Set userid
     *
     * @param integer $userid
     * @return song
     */
    public function setUserid($userid)
    {
        $this->userid = $userid;

        return $this;
    }

    /**
     * Get userid
     *
     * @return integer 
     */
    public function getUserid()
    {
        return $this->userid;
    }

    /**
     * Set songtitle
     *
     * @param string $songtitle
     * @return song
     */
    public function setSongtitle($songtitle)
    {
        $this->songtitle = $songtitle;

        return $this;
    }

    /**
     * Get songtitle
     *
     * @return string 
     */
    public function getSongtitle()
    {
        return $this->songtitle;
    }
}
