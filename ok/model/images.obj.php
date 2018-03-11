<?php
/**
 * OK v.5 - okay-os.com
 *
 * Copyright (c) 2004-2018 Lubo Dyer. All Rights Reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License, version 3,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/.
 *
 * @package System
 */

/**
 *
 *
 * @package System
 */
class OK_Images extends OK_Items
{
    /**
     *
     */
    public function __construct()
    {
        parent::__construct("images");
    }

    /**
     *
     *
     */
    public function get_image_data($fname, $app_id, $bgaverage = false)
    {
        $image_data = array();

        if ($app_id == '.')
            $path = OK_ROOT;
        elseif ($app_id[0] == '.')
            $path = OK_ROOT . DIRECTORY_SEPARATOR . 'programs' . DIRECTORY_SEPARATOR . substr($app_id, 1);
        else
            $path = OK_PROGRAMS . DIRECTORY_SEPARATOR . $app_id;

        $fpath = $path . DIRECTORY_SEPARATOR . 'media' . DIRECTORY_SEPARATOR . $fname;

        if (!file_exists($fpath)) {
            throw new OK_Exception(sprintf("File \"%s\" does not exist.", $fpath));
        };

        $image_data['name'] = $fname;
        $image_data['path'] = $fpath;
        $image_data['image_data'] = getimagesize($fpath);
        $image_data['width'] = $image_data['image_data'][0];
        $image_data['height'] = $image_data['image_data'][1];

        if ($bgaverage) {
            $colors = array();
            $granularity = 5;
            $img = imagecreatefromstring(file_get_contents($fpath));

            for($x = 0; $x < $image_data['image_data'][0]; $x += $granularity)
            {
                for($y = 0; $y < $image_data['image_data'][1]; $y += $granularity)
                {
                    $thisColor = imagecolorat($img, $x, $y);
                    $rgb = imagecolorsforindex($img, $thisColor);
                    $red = round(round(($rgb['red'] / 0x33)) * 0x33);
                    $green = round(round(($rgb['green'] / 0x33)) * 0x33);
                    $blue = round(round(($rgb['blue'] / 0x33)) * 0x33);
                    $thisRGB = sprintf('%02X%02X%02X', $red, $green, $blue);
                    if(array_key_exists($thisRGB, $colors))
                    {
                        $colors[$thisRGB]++;
                    }
                    else
                    {
                        $colors[$thisRGB] = 1;
                    }
                }
            }

            arsort($colors);
            $keys = array_slice(array_keys($colors), 0, 1);
            $image_data['bgaverage'] = $keys[0];
        }

/*
        $cname = md5($fpath);
        $pi = pathinfo($fpath);
        $ftype = $pi['extension'];
        $cfname = $cname . '.' . $ftype;

        $subdir = substr(md5($app_id), 0, 8);
        $cdir = $this->config->media->root . DIRECTORY_SEPARATOR . $subdir;

        if (!is_dir($cdir) && !mkdir($cdir, 0777, true)) {
            throw new Exception(sprintf("Error creating directory \"%s\".", $cdir));
        }
        $cpath = $cdir . DIRECTORY_SEPARATOR . $cfname;

        if (!file_exists($cpath))
        {
            if (!copy($fpath, $cpath))
                throw new Exception("Error copying \"$fpath\" to \"$cpath\".");
        }
        else
        {
            if (filemtime($fpath) > filemtime($cpath))
            {
                if (!copy($fpath, $cpath)) {
                    throw new Exception("Error copying \"$fpath\" to \"$cpath\".");
                }
            }
        }

        $image_data['href'] = $this->config->media->url . '/' . $subdir . '/' . $cfname;
*/
        return $image_data;
    }

    /**
     *
     *
     *
    public function get_image_href($fname, $app_id = '.') {
        $data = $this->get_image_data($fname, $app_id);
        return $data['href'];
    }
    */

    /**
     *
     */
    public function get_image_content($fname, $app_id = '.')
    {
        if ($app_id == '.')
            $path = OK_ROOT;
        elseif ($app_id[0] == '.')
            $path = OK_ROOT . DIRECTORY_SEPARATOR . 'programs' . DIRECTORY_SEPARATOR . substr($app_id, 1);
        else
            $path = OK_PROGRAMS . DIRECTORY_SEPARATOR . $app_id;

        $fpath = $path . DIRECTORY_SEPARATOR . 'media' . DIRECTORY_SEPARATOR . $fname;

        if (!file_exists($fpath)) {
            throw new OK_Exception(sprintf("File \"%s\" does not exist.", $fpath));
        };

        $itype = getimagesize($fpath);
        $pinfo = $itype['mime'];
        return "data:$pinfo;base64," . base64_encode(file_get_contents($fpath));
    }

    /**
     *
     */
    public function load($src, $app_id = '.')
    {
        return $this->_load($src, $app_id);
    }
}
