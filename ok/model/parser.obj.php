<?php
/**
 * XML Parser - OK System Object.
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

// We would like to take care of xml errors on our own.
libxml_use_internal_errors(FALSE);

/**
 * XML Parser - OK System Object.
 *
 * @package System
 */
final class OK_Parser
{
    /**
     *
     */
    protected $_xml;

    /**
     *
     */
    public function __construct()
    {

    }

    /**
     *
     *
     * @param boolean $bParsePHP Indicates whether or not to process interface file through PHP first.
     */
    public function load($sFileName, $bAddToResponse = false, $bParsePHP = NULL, $sXMLVersion = '1.0', $sXMLEncoding = 'utf-8')
    {
        global $ok;

        // Vaidate file name
        if (!is_file($sFileName))
            trigger_error("Interface file \"$sFileName\" does not exist.");

        if ($bParsePHP == NULL)
            $bParsePHP = $ok->config->system->use_php_in_xml_files;

        $sXML = $bParsePHP ? $this->_passthrou($sFileName) : file_get_contents($sFileName);

        return $this->loadXML($sXML, $bAddToResponse, $sXMLVersion, $sXMLEncoding);
    }

    /**
     *
     *
     */
    public function loadXML($sXML, $bAddToResponse = false, $bParsePHP = NULL, $sXMLVersion = '1.0', $sXMLEncoding = 'utf-8')
    {
        global $ok;

        $this->_xml = new DOMDocument($sXMLVersion, $sXMLEncoding);
        $this->_xml->loadXML($sXML);

        $errors = libxml_get_errors();
        if (count($errors)) {
            foreach ($errors as $error) {
                $error_type = E_USER_ERROR;
                switch ($error->level) {
                    case LIBXML_ERR_WARNING:
                        $error_type = $E_USER_WARNING;
                    default:
                        trigger_error("XML PARSER: " . preg_replace("/\n/", "", $error->message) . " in " . $error->file . ' on line ' . $error->line . ", col " . $error->column . "." , $error_type);
                }
            }
        }

        // Validate OK XML root tag
        if ($this->_xml->documentElement->tagName != "ok")
            trigger_error("Error parsing \"$sFileName\". Interface files must start with \"ok\" tag.", E_USER_ERROR);


        // Locate interface section
        $nodelist = $this->_xml->documentElement->getElementsByTagName("interface");
        $interface = $nodelist->item(0);
        if (!$interface)
            trigger_error("Missing interface section in \"$sFileName\".", E_USER_ERROR);

        // Process response onload
        if ($interface->hasAttribute('onload'))
            $ok->response->onload = $interface->getAttribute('onload');

            $output = new OK_Collection;

        for ($i=0; $i<$interface->childNodes->length; $i++)
            $this->_toObject($interface->childNodes->item($i), $output, $bAddToResponse);

        return $output;
    }

    /**
     *
     */
    private function _toObject($node, $collection, $bAddToResponse = false)
    {
        global $ok;
        switch ($node->nodeType)
        {
            case XML_ELEMENT_NODE:

                $params = array();
                if ($node->hasAttribute('id'))
                    $params['id'] = $node->getAttribute('id');

                $object = $ok->create($node->tagName, $params);

                if ($bAddToResponse)
                    $ok->add($object);

                $_params = $object->_params;
                $_events = $object->_events;

                foreach ($_params as $param)
                    if ($node->hasAttribute($param))
                        $object->__set($param, $node->getAttribute($param));

                foreach ($_events as $event)
                    if ($node->hasAttribute($event))
                        $object->__set($event, $node->getAttribute($event));

                for ($i=0; $i<$node->attributes->length; $i++) {
                    $name = $node->attributes->item($i)->name;
                    if (strpos($name, '.') !== false)
                        $object->setProperty($name, $node->attributes->item($i)->value);
                }

                for ($i=0; $i<$node->childNodes->length; $i++)
                    $this->_toObject($node->childNodes->item($i), $object);

                $collection->add($object);
                break;

            case XML_CDATA_SECTION_NODE:
            case XML_TEXT_NODE:
                $value = trim($node->nodeValue);
                if (!empty($value))
                    $collection->write($value);
                break;
        }
    }

    /**
     *
     */
    private function _parse($input)
    {
        $pattern = "/\{\{.*\}\}/U";

        for ($i = 0, $l = preg_match_all($pattern, $input, $matches, PREG_OFFSET_CAPTURE | PREG_PATTERN_ORDER); $i < $l; $i++) {
            $ok->debug("match");
        }

        return $input;
    }

    /**
     *
     */
    private function _passthrou($sFileName)
    {
        global $ok;

        ob_start();
        require $sFileName;
        $output = ob_get_clean();
//      $ok->debug($output);
        return $output;
    }

}
