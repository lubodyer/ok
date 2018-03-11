<?php
/**
 * This file contains the Calendar OK Object.
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
 * @package Objects
 * @subpackage Input
 */

/**
 * Calendar - OK Object
 *
 * @package Objects
 * @subpackage Input
 */
class OK_Object_Calendar extends OK_Object
{
    /**
     * Retrieves the string identifying the type of the Object.
     * @var string
     */
    protected $_type = 'calendar';

    /**
     * Sets or retrieves the class name of the object.
     * @var string
     */
    protected $class = 'OK_CALENDAR';

    /**
     * Sets or retrieves the height of the object.
     * @var mixed
     */
    protected $height = '';

    /**
     * Sets or retrieves the custom style declarations for the object.
     * @var string
     */
    protected $style;

    /**
     * Sets or retrieves the width of the object.
     * @var mixed
     */
    protected $width = 250;

    protected $month = null;
    protected $year = null;
    protected $thismonth = true;
    protected $buttons = true;
    protected $bsize = 40;
    protected $hsize = 16;
    protected $rangeonly = false;
    protected $past = false;

    /**#@+
     * Object configuration settings.
     * @access private
     */

    protected $_accept = array();
    protected $_events = array('onselect');
    protected $_objects = array('style' => 'OK_Style');
    protected $_params = array('class', 'height', 'style', 'width', 'thismonth', 'month', 'year', 'buttons', 'bsize', 'hsize', 'rangeonly', 'past');
    protected $_scripts = array('calendar');
    protected $_styles = array('calendar');
    protected $dow = array('Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su');
    /**#@-*/

    /**
      Retreieves the output of the object.
     * @return string
     */
    protected function _toHTML()
    {
        $ref = $this->client->init('OK_Object_Calendar', $this->id, $this->class, $this->year, $this->month, $this->thismonth, $this->buttons, $this->bsize, $this->rangeonly, $this->past);
        $this->process_events($ref);

        // --

        if ($this->width) {
            $this->style->width = $this->width;
        }
        if ($this->height) {
            $this->style->height = $this->height;
        }

        $t = $this->create('table', array (
            'id' => $this->id,
            'style' => $this->style,
            'class' => $this->class,
            'width' => '',
            'height' => '',
            'noresize' => true,
            'nochildrenresize' => true
        ));

        $tr = $this->create('tr');

        $td = $this->create('td', array(
            'id' => $this->id . ':PREV',
            'class' => $this->class . '_HEADER',
            'width' => $this->bsize,
            'height' => $this->hsize,
            'align' => 'center',
            'valign' => 'middle',
            'style' => 'font-weight:bold;'
        ));
        $td->add($this->buttons ? '&laquo;' : '&#160;');
        $tr->add($td);

        $td = $this->create('td', array(
            'id' => $this->id . ':TITLE',
            'class' => $this->class . '_HEADER',
            'colspan' => 5,
            'align' => 'center',
            'valign' => 'middle',
            'style' => 'font-weight:bold;'
        ));
        $td->add('&#160;');
        $tr->add($td);

        $td = $this->create('td', array(
            'id' => $this->id . ':NEXT',
            'class' => $this->class . '_HEADER',
            'width' => $this->bsize,
            'height' => $this->hsize,
            'align' => 'center',
            'valign' => 'middle'
        ));
        $td->add($this->buttons ? '&raquo;' : '&#160;');
        $tr->add($td);

        $t->add($tr);

        $tr = $this->create('tr');
        for ($z = 0; $z < 7; $z++) {
            $td = $this->create('td', array(
                'width' => $this->bsize,
                'height' => $this->hsize,
                'align' => 'center',
                'valign' => 'middle',
                'class' => $this->class . '_MONTH'
            ));
            $td->add($this->dow[$z]);
            $tr->add($td);
        }
        $t->add($tr);

//      for ($i = 0; $i < 5; $i++) {
//          $tr = $this->create('tr');
//          for ($z = 0; $z < 7; $z++) {
//              $td = $this->create('td');
//              $td->add("$i:$z");
//              $tr->add($td);
//          }
//          $t->add($tr);
//      }

        return $t->toHTML();
    }

}
