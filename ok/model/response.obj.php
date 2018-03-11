<?php
/**
 * OK Response - OK System Object.
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
 * Response - OK System Object
 *
 * @package System
 */
final class OK_Response extends OK_Interface
{
    /**
     *
     *
     */
    public $content_type = "text/html";

    /**
     *
     */
    public $language = "en";

    /**
     *
     */
    public $links = array();

    /**
     *
     */
    public $target;

    /**
     *
     */
    protected $meta = array();

    /**
     *
     */
    protected $noscript = "";

    /**
     *
     */
    protected $method = OK::LAYOUT_REPLACE_CONTENT;

    /**
     *
     */
    protected $onload;

    /**
     * Whether or not to instruct browser to cache the response. Otherwise seconds to cache response.
     */
    protected $cache = false;

    /**
     *
     * @iname type-response
     */
    protected $type = 'auto';

    /**#@+
     * @access private
     */

    protected $_params = array('content_type', 'method', 'onload', 'target', 'type', 'meta', 'noscript', 'language', 'cache');
    protected $_validate = array(
        'content_type'  => 'text',
        'method'        => array(OK::LAYOUT_REPLACE_CONTENT, OK::LAYOUT_INSERT_AFTER, OK::LAYOUT_APPEND_CHILD),
        'target'        => 'text',
        'type'          => array('default', 'plain', 'auto', 'init'),
    );

    /**
     * Constructs the object and initializes content collection.
     */
    public function __construct()
    {
        parent::__construct();

        self::$_shared['_response'] = $this;
    }

    /**
     *
     */
    public function compress($contents)
    {
        // Consolidate new line characters
        $contents = preg_replace("/\r\n/", "\n", $contents);
        $contents = preg_replace("/\r/", "\n", $contents);

        // Compress white space
        $contents = preg_replace("/^[ \t]+/m", "", $contents);

        // Remove debug statements
        $contents = preg_replace("/^ok.debug\(.*$/m", "", $contents);

        // Remove block comments
        $contents = preg_replace("/(^|[^\\\])\/\*.*\*\//Us", "", $contents);
        // Remove line comments
        $contents = preg_replace("/(?:^| |\t)\/\/.*$/m", "", $contents);
        // Remove new lines
        $contents = preg_replace("/([a-z0-9])\n/", "$1 ", $contents);
        $contents = preg_replace("/\n/", "", $contents);

        $contents = preg_replace("/[ \t]+/", " ", $contents);

        return $contents;
    }

    /**#@-*/
}

