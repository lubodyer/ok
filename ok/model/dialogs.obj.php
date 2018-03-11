<?php
/**
 * This file contains the Dialogs OK System Object.
 *
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
 * Dialogs - OK System Object
 *
 * @package System
 */
final class OK_Dialogs extends OK_Items
{
    /**#@+
     * @access private
     */

    /** */
    public function __construct()
    {
        parent::__construct('dialog');
    }

    /**
     *
     * @iaccess private
     */
    public function __load(OK_Object_Dialog $dialog)
    {
        $this->client->store();

        if ($this->ok->_status == OK::INITIALIZING) {
            $this->client->init("OK_Object_Dialog", $dialog->id, $dialog->type, $dialog->left, $dialog->top, $dialog->width, $dialog->height, $dialog->class, $dialog->center, $dialog->close, $dialog->dock);
        }

        $this->items[] = array(
            'id' => $dialog->id,
            'class' => $dialog->class,
            'type' => $dialog->type,
            'dock' => $dialog->dock,
            'top' => $dialog->top,
            'left' => $dialog->left,
            'width' => $dialog->width,
            'height' => $dialog->height,
            'center' => $dialog->center,
            'close' => $dialog->close,
            'show' => $dialog->show,
            'html' => $dialog->toHTML(),
            'script' => $this->client->_get(true)
        );

        $this->client->restore();
        $dialog->destroy();
        return true;
    }

    /**#@-*/
}
