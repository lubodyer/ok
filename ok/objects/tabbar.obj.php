<?php
/**
 * This file contains the TabBar OK Object.
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
 * @subpackage Interface
 */

/**
 * TabBar - OK Object
 *
 * @package Objects
 * @subpackage Interface
 */
class OK_Object_TabBar extends OK_Object
{
    protected $_type = 'tabbar';

    protected $active = 0;
    protected $align = "center";
    protected $bgcolor;

    /**
     * Sets or retrieves the class name of the object.
     * @var string
     */
    protected $class = 'OK_TAB';

    protected $width = '100%';
    protected $height = "100%";

    /**
     * Sets or retrieves the layout of the object.
     * @var string
     */
    protected $position = "top";

    protected $tabsize;

    protected $app_id;

    protected $_params = array('active', 'align', 'class', 'width', 'height', 'bgcolor', 'tabsize', 'position', 'style');
    protected $_events = array('onbeforeactivate', 'onactivate');
    protected $_objects = array('style' => 'OK_Style');
    protected $_scripts = array('tabbar', 'tab');
    protected $_styles = array('tabbar');

    protected function onbeforeload()
    {
        if ($this->engine) {
            $this->app_id = $this->engine->app_id;
        }
//      $this->bgcolor = $this->config->colors->threedface;
    }

    protected function _toHTML()
    {
        $class = $this->class . '_' . strtoupper($this->position);

        $ref = $this->client->init('OK_Object_TabBox', $this->id, $class, $this->active);
        $this->process_events($ref);

        $tabsTable = $this->create("table", array(
            'id' => $this->id,
            'style' => $this->style,
            'width' => $this->width,
            'height' => $this->height,
            'bgcolor' => $this->bgcolor
        ));

        $first = "";
        $last = "";

        if ($this->position == "left" || $this->position == "right")
        {
            for ($i = 0, $m = 0, $tabs = 0; $i < $this->content->length; $i++, $m++)
            {
                $tab = $this->content->get($i);

                if ($tab->_type == 'tab') {
                    $tabID = $tab->id;
                    $tabCellID = $tabID.":cell";
                    $tabContentsID = $tabID.":contents";
                    $tabContainerID = $tabID.":container";

                    $table = $this->create("table");
                    $table->SetTableAttributes(array
                    (
                        "id"            => $tabID,
                        "border"        => "0",
                        "cellspacing"   => "0",
                        "cellpadding"   => "4",
                        "height"        => $this->tabsize
                    ));

                    $tab_content = "";
                    if ($tab->icon) {
                        $tab_content = $this->create('image', array(
                            'src' => $tab->icon,
                            'app_id' => $this->app_id
                        ));
                    }
                    $tab_content = $tab->title;

                    $table->SetCellContent(1, 1, $tab_content);
                    $table->SetCellAttribute(1, 1, "align", $this->position == "left" ? "right" : "left");
                    $table->SetCellAttribute(1, 1, "id", $tabCellID);
                    $table->SetCellAttribute(1, 1, "style", "white-space: nowrap;");

                    if ($tabs == $this->active)
                    {
                        $table->SetTableAttribute("class", $class . '_ACTIVE');
                        $table->SetCellAttribute(1, 1, "class", $class . '_ACTIVE_CELL');
                        $tabsTable->SetCellAttribute($m+1, 1, "class", $class . '_CONTAINER_ACTIVE');
                    }
                    elseif ($tabs < $this->active)
                    {
                        $table->SetTableAttribute("class", $class . '_INSET');
                        $table->SetCellAttribute(1, 1, "class", $class . '_INSET_CELL');
                        $tabsTable->SetCellAttribute($m+1, 1, "class", $class . '_CONTAINER_INACTIVE');
                    }
                    else
                    {
                        $table->SetTableAttribute("class", $class);
                        $table->SetCellAttribute(1, 1, "class", $class . '_CELL');
                        $tabsTable->SetCellAttribute($m+1, 1, "class", $class . '_CONTAINER_INACTIVE');
                    }

                    $tabsTable->SetCellAttribute($m+1, 1, "id", $tabContainerID);
                    $tabsTable->SetCellAttribute($m+1, 1, "height", "2%");
                    $tabsTable->SetCellAttribute($m+1, 1, "align", $this->position == 'left' ? 'right' : 'left');
                    $tabsTable->SetCellAttribute($m+1, 1, "valign", $this->position == 'top' ? 'bottom' : 'top');
                    $tabsTable->SetCellContent($m+1, 1, $table->toHTML());
                    unset($table);

                    $this->client->init('OK_Object_Tab', $tabID, $tab->title, null, !$tab->disabled, $tab->class);
                    $this->client->call($ref, 'add', $tabID);

                    $tabs++;
                } elseif ($tabs) {
                    $last .= $tab->toHTML();
                    $talign = $tab->align;
                    $m--;
                } else {
                    $tabsTable->SetCellAttribute($m+1, 1, "class", $class . '_EMPTY');
                    $tabsTable->SetCellAttribute($m+1, 1, "height", "2%");
                    $tabsTable->SetCellContent($m+1, 1, $tab->toHTML());
                }
            }

            $tabsTable->SetCellContent($m+1, 1, $last ? $last : "&#160;");
            if (isset($talign)) {
                $tabsTable->SetAttributeContent($m+1, 1, "align", $talign);
            }
            $tabsTable->SetCellAttribute($m+1, 1, "class", $class . '_EMPTY');
            $tabsTable->SetCellAttribute($m+1, 1, "height", (100-$m*2)."%");
        }
        else
        {
            $this->add($this->create('tab', array(
                'id' => $this->id . ':TTAB',
                'title' => '...'
            )));

            for ($i = 0, $m = 0, $tabs = 0; $i < $this->content->length; $i++, $m++)
            {
                $tab = $this->content->get($i);

                if ($tab->_type == 'tab') {
                    $tabID = $tab->id;
                    $tabCellID = $tabID.":cell";
                    $tabContentsID = $tabID.":contents";
                    $tabContainerID = $tabID.":container";

                    $table = $this->create("table");
                    $table->SetTableAttributes(array
                    (
                        "id"            => $tabID,
                        "border"        => "0",
                        "cellspacing"   => "0",
                        "cellpadding"   => "4",
                        "width"         => $this->tabsize
                    ));

                    $table->SetCellContent(1, 1, $tab->title);
                    $table->SetCellAttribute(1, 1, "align", $this->align);
                    $table->SetCellAttribute(1, 1, "id", $tabCellID);
                    $table->SetCellAttribute(1, 1, "style", "white-space: nowrap;");

                    if ($tabs == $this->active)
                    {
                        $table->SetTableAttribute("class", $class . '_ACTIVE');
                        $table->SetCellAttribute(1, 1, "class", $class . '_ACTIVE_CELL');
                        $tabsTable->SetCellAttribute(1, $m+1, "class", $class . '_CONTAINER_ACTIVE');
                    }
                    elseif ($tabs < $this->active)
                    {
                        $table->SetTableAttribute("class", $class . '_INSET');
                        $table->SetCellAttribute(1, 1, "class", $class . '_INSET_CELL');
                        $tabsTable->SetCellAttribute(1, $m+1, "class", $class . '_CONTAINER_INACTIVE');
                    }
                    else
                    {
                        $table->SetTableAttribute("class", $class);
                        $table->SetCellAttribute(1, 1, "class", $class . '_CELL');
                        $tabsTable->SetCellAttribute(1, $m+1, "class", $class . '_CONTAINER_INACTIVE');
                    }

                    $tabsTable->SetCellAttribute(1, $m+1, "id", $tabContainerID);
                    $tabsTable->SetCellAttribute(1, $m+1, "width", "2");
                    $tabsTable->SetCellAttribute(1, $m+1, "valign", $this->position == 'top' ? 'bottom' : 'top');
                    $tabsTable->SetCellContent(1, $m+1, $table->toHTML());
                    unset($table);

                    $this->client->init('OK_Object_Tab', $tabID, $tab->title, null, !$tab->disabled, $tab->class);
                    $this->client->call($ref, 'add', $tabID);

                    $tabs++;
                } elseif ($tabs) {
                    $last .= $tab->toHTML();
                    $m--;
                } else {
                    $tabsTable->SetCellAttribute(1, $m+1, "class", $class . '_EMPTY');
                    $tabsTable->SetCellAttribute(1, $m+1, "width", "2");
                    $tabsTable->SetCellContent(1, $m+1, $tab->toHTML());
                }
            }

            $tabsTable->SetCellContent(1, $m+1, $last ? $last : "&#160;");
            $tabsTable->SetCellAttribute(1, $m+1, "class", $class . '_EMPTY');
            //$tabsTable->SetCellAttribute(1, $m+1, "width", (100-$m)."%");
        }

        $tabsTable->noresize = true;
        $tabsTable->nochildrenresize = true;

        $menu = $this->create('menu', array(
            'id' => $this->id . ':MORE:MENU'
        ));

        return $tabsTable->toHTML() . $menu->toHTML();
    }
}
