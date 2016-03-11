ace.define("ace/mode/lsl_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

oop.inherits(LSLHighlightRules, TextHighlightRules);

function LSLHighlightRules() {

    var keywordControls = (
        "iteration|branch|selection"
    );
    
    var storageType = (
        "action|process|agent|script|requires"
    );

    var storageModifiers = (
        "provides|select"
    );

    var keywordOperators = (
        "and|and_eq|bitand|bitor|compl|not|not_eq|or|or_eq|typeid|xor|xor_eq" +
        "const_cast|dynamic_cast|reinterpret_cast|static_cast|sizeof|namespace"
    );

    var builtinConstants = (
        "NULL|true|false|TRUE|FALSE|nullptr"
    );

    var keywordMapper = this.createKeywordMapper({
      
        "keyword.control" : keywordControls,
        "storage.type" : storageType,
        "storage.modifier" : storageModifiers,
        "keyword.operator" : keywordOperators,
        "variable.language": "this",
        "constant.language": builtinConstants




        "constant.language.integer.boolean.lsl" : "FALSE|TRUE",
        "constant.language.quaternion.lsl" : "ZERO_ROTATION",
        "constant.language.string.lsl" : "EOF|JSON_ARRAY|JSON_DELETE|JSON_FALSE|JSON_INVALID|JSON_NULL|JSON_NUMBER|JSON_OBJECT|JSON_STRING|JSON_TRUE|NULL_KEY|TEXTURE_BLANK|TEXTURE_DEFAULT|TEXTURE_MEDIA|TEXTURE_PLYWOOD|TEXTURE_TRANSPARENT|URL_REQUEST_DENIED|URL_REQUEST_GRANTED",
        "constant.language.vector.lsl" : "TOUCH_INVALID_TEXCOORD|TOUCH_INVALID_VECTOR|ZERO_VECTOR",
        "invalid.broken.lsl": "LAND_LARGE_BRUSH|LAND_MEDIUM_BRUSH|LAND_SMALL_BRUSH",
        "invalid.deprecated.lsl" : "ATTACH_LPEC|ATTACH_RPEC|DATA_RATING|OBJECT_ATTACHMENT_GEOMETRY_BYTES|OBJECT_ATTACHMENT_SURFACE_AREA|PRIM_CAST_SHADOWS|PRIM_MATERIAL_LIGHT|PRIM_TYPE_LEGACY|PSYS_SRC_INNERANGLE|PSYS_SRC_OUTERANGLE|VEHICLE_FLAG_NO_FLY_UP|llClearExperiencePermissions|llCloud|llGetExperienceList|llMakeExplosion|llMakeFire|llMakeFountain|llMakeSmoke|llRemoteDataSetRegion|llSound|llSoundPreload|llXorBase64Strings|llXorBase64StringsCorrect",
        "invalid.illegal.lsl": "event",
        "invalid.unimplemented.lsl": "CHARACTER_MAX_ANGULAR_ACCEL|CHARACTER_MAX_ANGULAR_SPEED|CHARACTER_TURN_SPEED_MULTIPLIER|PERMISSION_CHANGE_JOINTS|PERMISSION_CHANGE_PERMISSIONS|PERMISSION_EXPERIENCE|PERMISSION_RELEASE_OWNERSHIP|PERMISSION_REMAP_CONTROLS|PRIM_PHYSICS_MATERIAL|PSYS_SRC_OBJ_REL_MASK|llCollisionSprite|llPointAt|llRefreshPrimURL|llReleaseCamera|llRemoteLoadScript|llSetPrimURL|llStopPointAt|llTakeCamera",
        "reserved.godmode.lsl": "llGodLikeRezObject|llSetInventoryPermMask|llSetObjectPermMask",
        "reserved.log.lsl" : "print",
        "keyword.control.lsl" : "do|else|for|if|jump|return|while",
        "storage.type.lsl" : "float|integer|key|list|quaternion|rotation|string|vector",
        "support.function.lsl": "llAbs|llAcos|llAddToLandBanList|llAddToLandPassList|llAdjustSoundVolume|llAgentInExperience|llAllowInventoryDrop|llAngleBetween|llApplyImpulse|llApplyRotationalImpulse|llAsin|llAtan2|llAttachToAvatar|llAttachToAvatarTemp|llAvatarOnLinkSitTarget|llAvatarOnSitTarget|llAxes2Rot|llAxisAngle2Rot|llBase64ToInteger|llBase64ToString|llBreakAllLinks|llBreakLink|llCSV2List|llCastRay|llCeil|llClearCameraParams|llClearLinkMedia|llClearPrimMedia|llCloseRemoteDataChannel|llCollisionFilter|llCollisionSound|llCos|llCreateCharacter|llCreateKeyValue|llCreateLink|llDataSizeKeyValue|llDeleteCharacter|llDeleteKeyValue|llDeleteSubList|llDeleteSubString|llDetachFromAvatar|llDetectedGrab|llDetectedGroup|llDetectedKey|llDetectedLinkNumber|llDetectedName|llDetectedOwner|llDetectedPos|llDetectedRot|llDetectedTouchBinormal|llDetectedTouchFace|llDetectedTouchNormal|llDetectedTouchPos|llDetectedTouchST|llDetectedTouchUV|llDetectedType|llDetectedVel|llDialog|llDie|llDumpList2String|llEdgeOfWorld|llEjectFromLand|llEmail|llEscapeURL|llEuler2Rot|llEvade|llExecCharacterCmd|llFabs|llFleeFrom|llFloor|llForceMouselook|llFrand|llGenerateKey|llGetAccel|llGetAgentInfo|llGetAgentLanguage|llGetAgentList|llGetAgentSize|llGetAlpha|llGetAndResetTime|llGetAnimation|llGetAnimationList|llGetAnimationOverride|llGetAttached|llGetAttachedList|llGetBoundingBox|llGetCameraPos|llGetCameraRot|llGetCenterOfMass|llGetClosestNavPoint|llGetColor|llGetCreator|llGetDate|llGetDisplayName|llGetEnergy|llGetEnv|llGetExperienceDetails|llGetExperienceErrorMessage|llGetForce|llGetFreeMemory|llGetFreeURLs|llGetGMTclock|llGetGeometricCenter|llGetHTTPHeader|llGetInventoryCreator|llGetInventoryKey|llGetInventoryName|llGetInventoryNumber|llGetInventoryPermMask|llGetInventoryType|llGetKey|llGetLandOwnerAt|llGetLinkKey|llGetLinkMedia|llGetLinkName|llGetLinkNumber|llGetLinkNumberOfSides|llGetLinkPrimitiveParams|llGetListEntryType|llGetListLength|llGetLocalPos|llGetLocalRot|llGetMass|llGetMassMKS|llGetMaxScaleFactor|llGetMemoryLimit|llGetMinScaleFactor|llGetNextEmail|llGetNotecardLine|llGetNumberOfNotecardLines|llGetNumberOfPrims|llGetNumberOfSides|llGetObjectDesc|llGetObjectDetails|llGetObjectMass|llGetObjectName|llGetObjectPermMask|llGetObjectPrimCount|llGetOmega|llGetOwner|llGetOwnerKey|llGetParcelDetails|llGetParcelFlags|llGetParcelMaxPrims|llGetParcelMusicURL|llGetParcelPrimCount|llGetParcelPrimOwners|llGetPermissions|llGetPermissionsKey|llGetPhysicsMaterial|llGetPos|llGetPrimMediaParams|llGetPrimitiveParams|llGetRegionAgentCount|llGetRegionCorner|llGetRegionFPS|llGetRegionFlags|llGetRegionName|llGetRegionTimeDilation|llGetRootPosition|llGetRootRotation|llGetRot|llGetSPMaxMemory|llGetScale|llGetScriptName|llGetScriptState|llGetSimStats|llGetSimulatorHostname|llGetStartParameter|llGetStaticPath|llGetStatus|llGetSubString|llGetSunDirection|llGetTexture|llGetTextureOffset|llGetTextureRot|llGetTextureScale|llGetTime|llGetTimeOfDay|llGetTimestamp|llGetTorque|llGetUnixTime|llGetUsedMemory|llGetUsername|llGetVel|llGetWallclock|llGiveInventory|llGiveInventoryList|llGiveMoney|llGround|llGroundContour|llGroundNormal|llGroundRepel|llGroundSlope|llHTTPRequest|llHTTPResponse|llInsertString|llInstantMessage|llIntegerToBase64|llJson2List|llJsonGetValue|llJsonSetValue|llJsonValueType|llKey2Name|llKeyCountKeyValue|llKeysKeyValue|llLinkParticleSystem|llLinkSitTarget|llList2CSV|llList2Float|llList2Integer|llList2Json|llList2Key|llList2List|llList2ListStrided|llList2Rot|llList2String|llList2Vector|llListFindList|llListInsertList|llListRandomize|llListReplaceList|llListSort|llListStatistics|llListen|llListenControl|llListenRemove|llLoadURL|llLog|llLog10|llLookAt|llLoopSound|llLoopSoundMaster|llLoopSoundSlave|llMD5String|llManageEstateAccess|llMapDestination|llMessageLinked|llMinEventDelay|llModPow|llModifyLand|llMoveToTarget|llNavigateTo|llOffsetTexture|llOpenRemoteDataChannel|llOverMyLand|llOwnerSay|llParcelMediaCommandList|llParcelMediaQuery|llParseString2List|llParseStringKeepNulls|llParticleSystem|llPassCollisions|llPassTouches|llPatrolPoints|llPlaySound|llPlaySoundSlave|llPow|llPreloadSound|llPursue|llPushObject|llReadKeyValue|llRegionSay|llRegionSayTo|llReleaseControls|llReleaseURL|llRemoteDataReply|llRemoteLoadScriptPin|llRemoveFromLandBanList|llRemoveFromLandPassList|llRemoveInventory|llRemoveVehicleFlags|llRequestAgentData|llRequestDisplayName|llRequestExperiencePermissions|llRequestInventoryData|llRequestPermissions|llRequestSecureURL|llRequestSimulatorData|llRequestURL|llRequestUsername|llResetAnimationOverride|llResetLandBanList|llResetLandPassList|llResetOtherScript|llResetScript|llResetTime|llReturnObjectsByID|llReturnObjectsByOwner|llRezAtRoot|llRezObject|llRot2Angle|llRot2Axis|llRot2Euler|llRot2Fwd|llRot2Left|llRot2Up|llRotBetween|llRotLookAt|llRotTarget|llRotTargetRemove|llRotateTexture|llRound|llSHA1String|llSameGroup|llSay|llScaleByFactor|llScaleTexture|llScriptDanger|llScriptProfiler|llSendRemoteData|llSensor|llSensorRemove|llSensorRepeat|llSetAlpha|llSetAngularVelocity|llSetAnimationOverride|llSetBuoyancy|llSetCameraAtOffset|llSetCameraEyeOffset|llSetCameraParams|llSetClickAction|llSetColor|llSetContentType|llSetDamage|llSetForce|llSetForceAndTorque|llSetHoverHeight|llSetKeyframedMotion|llSetLinkAlpha|llSetLinkCamera|llSetLinkColor|llSetLinkMedia|llSetLinkPrimitiveParams|llSetLinkPrimitiveParamsFast|llSetLinkTexture|llSetLinkTextureAnim|llSetLocalRot|llSetMemoryLimit|llSetObjectDesc|llSetObjectName|llSetParcelMusicURL|llSetPayPrice|llSetPhysicsMaterial|llSetPos|llSetPrimMediaParams|llSetPrimitiveParams|llSetRegionPos|llSetRemoteScriptAccessPin|llSetRot|llSetScale|llSetScriptState|llSetSitText|llSetSoundQueueing|llSetSoundRadius|llSetStatus|llSetText|llSetTexture|llSetTextureAnim|llSetTimerEvent|llSetTorque|llSetTouchText|llSetVehicleFlags|llSetVehicleFloatParam|llSetVehicleRotationParam|llSetVehicleType|llSetVehicleVectorParam|llSetVelocity|llShout|llSin|llSitTarget|llSleep|llSqrt|llStartAnimation|llStopAnimation|llStopHover|llStopLookAt|llStopMoveToTarget|llStopSound|llStringLength|llStringToBase64|llStringTrim|llSubStringIndex|llTakeControls|llTan|llTarget|llTargetOmega|llTargetRemove|llTeleportAgent|llTeleportAgentGlobalCoords|llTeleportAgentHome|llTextBox|llToLower|llToUpper|llTransferLindenDollars|llTriggerSound|llTriggerSoundLimited|llUnSit|llUnescapeURL|llUpdateCharacter|llUpdateKeyValue|llVecDist|llVecMag|llVecNorm|llVolumeDetect|llWanderWithin|llWater|llWhisper|llWind|llXorBase64",
        "support.function.event.lsl" : "at_rot_target|at_target|attach|changed|collision|collision_end|collision_start|control|dataserver|email|experience_permissions|experience_permissions_denied|http_request|http_response|land_collision|land_collision_end|land_collision_start|link_message|listen|money|moving_end|moving_start|no_sensor|not_at_rot_target|not_at_target|object_rez|on_rez|path_update|remote_data|run_time_permissions|sensor|state_entry|state_exit|timer|touch|touch_end|touch_start|transaction_result"
        }, "identifier");

    this.$rules = {
        "start" : [
            {
                token : "comment.line.double-slash.lsl",
                regex : "\\/\\/.*$"
            }, {
                token : "comment.block.begin.lsl",
                regex : "\\/\\*",
                next : "comment"
            }, {
                token : "string.quoted.double.lsl",
                start : '"',
                end : '"',
                next : [{
                    token : "constant.character.escape.lsl",
                    regex : /\\[tn"\\]/
                }]
            }, {
                token : "constant.numeric.lsl",
                regex : "(0[xX][0-9a-fA-F]+|[+-]?[0-9]+(?:(?:\\.[0-9]*)?(?:[eE][+-]?[0-9]+)?)?)\\b"
            }, {
                token : "entity.name.state.lsl",
                regex : "\\b((state)\\s+[A-Za-z_]\\w*|default)\\b"
            }, {
                token : keywordMapper,
                regex : "\\b[a-zA-Z_][a-zA-Z0-9_]*\\b"
            }, {
                token : "support.function.user-defined.lsl",
                regex : /\b([a-zA-Z_]\w*)(?=\(.*?\))/
            }, {
                token : "keyword.operator.lsl",
                regex : "\\+\\+|\\-\\-|<<|>>|&&?|\\|\\|?|\\^|~|[!%<>=*+\\-\\/]=?"
            }, {
                token : "invalid.illegal.keyword.operator.lsl",
                regex : ":=?"
            }, {
                token : "punctuation.operator.lsl",
                regex : "\\,|\\;"
            }, {
                token : "paren.lparen.lsl",
                regex : "[\\[\\(\\{]"
            }, {
                token : "paren.rparen.lsl",
                regex : "[\\]\\)\\}]"
            }, {
                token : "text.lsl",
                regex : "\\s+"
            }
        ],
        "comment" : [
            {
                token : "comment.block.end.lsl",
                regex : "\\*\\/",
                next : "start"
            }, {
                defaultToken : "comment.block.lsl"
            }
        ]
    };
    this.normalizeRules();
}

exports.LSLHighlightRules = LSLHighlightRules;
});

ace.define("ace/mode/matching_brace_outdent",["require","exports","module","ace/range"], function(require, exports, module) {
"use strict";

var Range = require("../range").Range;

var MatchingBraceOutdent = function() {};

(function() {

    this.checkOutdent = function(line, input) {
        if (! /^\s+$/.test(line))
            return false;

        return /^\s*\}/.test(input);
    };

    this.autoOutdent = function(doc, row) {
        var line = doc.getLine(row);
        var match = line.match(/^(\s*\})/);

        if (!match) return 0;

        var column = match[1].length;
        var openBracePos = doc.findMatchingBracket({row: row, column: column});

        if (!openBracePos || openBracePos.row == row) return 0;

        var indent = this.$getIndent(doc.getLine(openBracePos.row));
        doc.replace(new Range(row, 0, row, column-1), indent);
    };

    this.$getIndent = function(line) {
        return line.match(/^\s*/)[0];
    };

}).call(MatchingBraceOutdent.prototype);

exports.MatchingBraceOutdent = MatchingBraceOutdent;
});

ace.define("ace/mode/behaviour/cstyle",["require","exports","module","ace/lib/oop","ace/mode/behaviour","ace/token_iterator","ace/lib/lang"], function(require, exports, module) {
"use strict";

var oop = require("../../lib/oop");
var Behaviour = require("../behaviour").Behaviour;
var TokenIterator = require("../../token_iterator").TokenIterator;
var lang = require("../../lib/lang");

var SAFE_INSERT_IN_TOKENS =
    ["text", "paren.rparen", "punctuation.operator"];
var SAFE_INSERT_BEFORE_TOKENS =
    ["text", "paren.rparen", "punctuation.operator", "comment"];

var context;
var contextCache = {};
var initContext = function(editor) {
    var id = -1;
    if (editor.multiSelect) {
        id = editor.selection.index;
        if (contextCache.rangeCount != editor.multiSelect.rangeCount)
            contextCache = {rangeCount: editor.multiSelect.rangeCount};
    }
    if (contextCache[id])
        return context = contextCache[id];
    context = contextCache[id] = {
        autoInsertedBrackets: 0,
        autoInsertedRow: -1,
        autoInsertedLineEnd: "",
        maybeInsertedBrackets: 0,
        maybeInsertedRow: -1,
        maybeInsertedLineStart: "",
        maybeInsertedLineEnd: ""
    };
};

var getWrapped = function(selection, selected, opening, closing) {
    var rowDiff = selection.end.row - selection.start.row;
    return {
        text: opening + selected + closing,
        selection: [
                0,
                selection.start.column + 1,
                rowDiff,
                selection.end.column + (rowDiff ? 0 : 1)
            ]
    };
};

var CstyleBehaviour = function() {
    this.add("braces", "insertion", function(state, action, editor, session, text) {
        var cursor = editor.getCursorPosition();
        var line = session.doc.getLine(cursor.row);
        if (text == '{') {
            initContext(editor);
            var selection = editor.getSelectionRange();
            var selected = session.doc.getTextRange(selection);
            if (selected !== "" && selected !== "{" && editor.getWrapBehavioursEnabled()) {
                return getWrapped(selection, selected, '{', '}');
            } else if (CstyleBehaviour.isSaneInsertion(editor, session)) {
                if (/[\]\}\)]/.test(line[cursor.column]) || editor.inMultiSelectMode) {
                    CstyleBehaviour.recordAutoInsert(editor, session, "}");
                    return {
                        text: '{}',
                        selection: [1, 1]
                    };
                } else {
                    CstyleBehaviour.recordMaybeInsert(editor, session, "{");
                    return {
                        text: '{',
                        selection: [1, 1]
                    };
                }
            }
        } else if (text == '}') {
            initContext(editor);
            var rightChar = line.substring(cursor.column, cursor.column + 1);
            if (rightChar == '}') {
                var matching = session.$findOpeningBracket('}', {column: cursor.column + 1, row: cursor.row});
                if (matching !== null && CstyleBehaviour.isAutoInsertedClosing(cursor, line, text)) {
                    CstyleBehaviour.popAutoInsertedClosing();
                    return {
                        text: '',
                        selection: [1, 1]
                    };
                }
            }
        } else if (text == "\n" || text == "\r\n") {
            initContext(editor);
            var closing = "";
            if (CstyleBehaviour.isMaybeInsertedClosing(cursor, line)) {
                closing = lang.stringRepeat("}", context.maybeInsertedBrackets);
                CstyleBehaviour.clearMaybeInsertedClosing();
            }
            var rightChar = line.substring(cursor.column, cursor.column + 1);
            if (rightChar === '}') {
                var openBracePos = session.findMatchingBracket({row: cursor.row, column: cursor.column+1}, '}');
                if (!openBracePos)
                     return null;
                var next_indent = this.$getIndent(session.getLine(openBracePos.row));
            } else if (closing) {
                var next_indent = this.$getIndent(line);
            } else {
                CstyleBehaviour.clearMaybeInsertedClosing();
                return;
            }
            var indent = next_indent + session.getTabString();

            return {
                text: '\n' + indent + '\n' + next_indent + closing,
                selection: [1, indent.length, 1, indent.length]
            };
        } else {
            CstyleBehaviour.clearMaybeInsertedClosing();
        }
    });

    this.add("braces", "deletion", function(state, action, editor, session, range) {
        var selected = session.doc.getTextRange(range);
        if (!range.isMultiLine() && selected == '{') {
            initContext(editor);
            var line = session.doc.getLine(range.start.row);
            var rightChar = line.substring(range.end.column, range.end.column + 1);
            if (rightChar == '}') {
                range.end.column++;
                return range;
            } else {
                context.maybeInsertedBrackets--;
            }
        }
    });

    this.add("parens", "insertion", function(state, action, editor, session, text) {
        if (text == '(') {
            initContext(editor);
            var selection = editor.getSelectionRange();
            var selected = session.doc.getTextRange(selection);
            if (selected !== "" && editor.getWrapBehavioursEnabled()) {
                return getWrapped(selection, selected, '(', ')');
            } else if (CstyleBehaviour.isSaneInsertion(editor, session)) {
                CstyleBehaviour.recordAutoInsert(editor, session, ")");
                return {
                    text: '()',
                    selection: [1, 1]
                };
            }
        } else if (text == ')') {
            initContext(editor);
            var cursor = editor.getCursorPosition();
            var line = session.doc.getLine(cursor.row);
            var rightChar = line.substring(cursor.column, cursor.column + 1);
            if (rightChar == ')') {
                var matching = session.$findOpeningBracket(')', {column: cursor.column + 1, row: cursor.row});
                if (matching !== null && CstyleBehaviour.isAutoInsertedClosing(cursor, line, text)) {
                    CstyleBehaviour.popAutoInsertedClosing();
                    return {
                        text: '',
                        selection: [1, 1]
                    };
                }
            }
        }
    });

    this.add("parens", "deletion", function(state, action, editor, session, range) {
        var selected = session.doc.getTextRange(range);
        if (!range.isMultiLine() && selected == '(') {
            initContext(editor);
            var line = session.doc.getLine(range.start.row);
            var rightChar = line.substring(range.start.column + 1, range.start.column + 2);
            if (rightChar == ')') {
                range.end.column++;
                return range;
            }
        }
    });

    this.add("brackets", "insertion", function(state, action, editor, session, text) {
        if (text == '[') {
            initContext(editor);
            var selection = editor.getSelectionRange();
            var selected = session.doc.getTextRange(selection);
            if (selected !== "" && editor.getWrapBehavioursEnabled()) {
                return getWrapped(selection, selected, '[', ']');
            } else if (CstyleBehaviour.isSaneInsertion(editor, session)) {
                CstyleBehaviour.recordAutoInsert(editor, session, "]");
                return {
                    text: '[]',
                    selection: [1, 1]
                };
            }
        } else if (text == ']') {
            initContext(editor);
            var cursor = editor.getCursorPosition();
            var line = session.doc.getLine(cursor.row);
            var rightChar = line.substring(cursor.column, cursor.column + 1);
            if (rightChar == ']') {
                var matching = session.$findOpeningBracket(']', {column: cursor.column + 1, row: cursor.row});
                if (matching !== null && CstyleBehaviour.isAutoInsertedClosing(cursor, line, text)) {
                    CstyleBehaviour.popAutoInsertedClosing();
                    return {
                        text: '',
                        selection: [1, 1]
                    };
                }
            }
        }
    });

    this.add("brackets", "deletion", function(state, action, editor, session, range) {
        var selected = session.doc.getTextRange(range);
        if (!range.isMultiLine() && selected == '[') {
            initContext(editor);
            var line = session.doc.getLine(range.start.row);
            var rightChar = line.substring(range.start.column + 1, range.start.column + 2);
            if (rightChar == ']') {
                range.end.column++;
                return range;
            }
        }
    });

    this.add("string_dquotes", "insertion", function(state, action, editor, session, text) {
        if (text == '"' || text == "'") {
            initContext(editor);
            var quote = text;
            var selection = editor.getSelectionRange();
            var selected = session.doc.getTextRange(selection);
            if (selected !== "" && selected !== "'" && selected != '"' && editor.getWrapBehavioursEnabled()) {
                return getWrapped(selection, selected, quote, quote);
            } else if (!selected) {
                var cursor = editor.getCursorPosition();
                var line = session.doc.getLine(cursor.row);
                var leftChar = line.substring(cursor.column-1, cursor.column);
                var rightChar = line.substring(cursor.column, cursor.column + 1);
                
                var token = session.getTokenAt(cursor.row, cursor.column);
                var rightToken = session.getTokenAt(cursor.row, cursor.column + 1);
                if (leftChar == "\\" && token && /escape/.test(token.type))
                    return null;
                
                var stringBefore = token && /string|escape/.test(token.type);
                var stringAfter = !rightToken || /string|escape/.test(rightToken.type);
                
                var pair;
                if (rightChar == quote) {
                    pair = stringBefore !== stringAfter;
                } else {
                    if (stringBefore && !stringAfter)
                        return null; // wrap string with different quote
                    if (stringBefore && stringAfter)
                        return null; // do not pair quotes inside strings
                    var wordRe = session.$mode.tokenRe;
                    wordRe.lastIndex = 0;
                    var isWordBefore = wordRe.test(leftChar);
                    wordRe.lastIndex = 0;
                    var isWordAfter = wordRe.test(leftChar);
                    if (isWordBefore || isWordAfter)
                        return null; // before or after alphanumeric
                    if (rightChar && !/[\s;,.})\]\\]/.test(rightChar))
                        return null; // there is rightChar and it isn't closing
                    pair = true;
                }
                return {
                    text: pair ? quote + quote : "",
                    selection: [1,1]
                };
            }
        }
    });

    this.add("string_dquotes", "deletion", function(state, action, editor, session, range) {
        var selected = session.doc.getTextRange(range);
        if (!range.isMultiLine() && (selected == '"' || selected == "'")) {
            initContext(editor);
            var line = session.doc.getLine(range.start.row);
            var rightChar = line.substring(range.start.column + 1, range.start.column + 2);
            if (rightChar == selected) {
                range.end.column++;
                return range;
            }
        }
    });

};

    
CstyleBehaviour.isSaneInsertion = function(editor, session) {
    var cursor = editor.getCursorPosition();
    var iterator = new TokenIterator(session, cursor.row, cursor.column);
    if (!this.$matchTokenType(iterator.getCurrentToken() || "text", SAFE_INSERT_IN_TOKENS)) {
        var iterator2 = new TokenIterator(session, cursor.row, cursor.column + 1);
        if (!this.$matchTokenType(iterator2.getCurrentToken() || "text", SAFE_INSERT_IN_TOKENS))
            return false;
    }
    iterator.stepForward();
    return iterator.getCurrentTokenRow() !== cursor.row ||
        this.$matchTokenType(iterator.getCurrentToken() || "text", SAFE_INSERT_BEFORE_TOKENS);
};

CstyleBehaviour.$matchTokenType = function(token, types) {
    return types.indexOf(token.type || token) > -1;
};

CstyleBehaviour.recordAutoInsert = function(editor, session, bracket) {
    var cursor = editor.getCursorPosition();
    var line = session.doc.getLine(cursor.row);
    if (!this.isAutoInsertedClosing(cursor, line, context.autoInsertedLineEnd[0]))
        context.autoInsertedBrackets = 0;
    context.autoInsertedRow = cursor.row;
    context.autoInsertedLineEnd = bracket + line.substr(cursor.column);
    context.autoInsertedBrackets++;
};

CstyleBehaviour.recordMaybeInsert = function(editor, session, bracket) {
    var cursor = editor.getCursorPosition();
    var line = session.doc.getLine(cursor.row);
    if (!this.isMaybeInsertedClosing(cursor, line))
        context.maybeInsertedBrackets = 0;
    context.maybeInsertedRow = cursor.row;
    context.maybeInsertedLineStart = line.substr(0, cursor.column) + bracket;
    context.maybeInsertedLineEnd = line.substr(cursor.column);
    context.maybeInsertedBrackets++;
};

CstyleBehaviour.isAutoInsertedClosing = function(cursor, line, bracket) {
    return context.autoInsertedBrackets > 0 &&
        cursor.row === context.autoInsertedRow &&
        bracket === context.autoInsertedLineEnd[0] &&
        line.substr(cursor.column) === context.autoInsertedLineEnd;
};

CstyleBehaviour.isMaybeInsertedClosing = function(cursor, line) {
    return context.maybeInsertedBrackets > 0 &&
        cursor.row === context.maybeInsertedRow &&
        line.substr(cursor.column) === context.maybeInsertedLineEnd &&
        line.substr(0, cursor.column) == context.maybeInsertedLineStart;
};

CstyleBehaviour.popAutoInsertedClosing = function() {
    context.autoInsertedLineEnd = context.autoInsertedLineEnd.substr(1);
    context.autoInsertedBrackets--;
};

CstyleBehaviour.clearMaybeInsertedClosing = function() {
    if (context) {
        context.maybeInsertedBrackets = 0;
        context.maybeInsertedRow = -1;
    }
};



oop.inherits(CstyleBehaviour, Behaviour);

exports.CstyleBehaviour = CstyleBehaviour;
});

ace.define("ace/mode/folding/cstyle",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"], function(require, exports, module) {
"use strict";

var oop = require("../../lib/oop");
var Range = require("../../range").Range;
var BaseFoldMode = require("./fold_mode").FoldMode;

var FoldMode = exports.FoldMode = function(commentRegex) {
    if (commentRegex) {
        this.foldingStartMarker = new RegExp(
            this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.start)
        );
        this.foldingStopMarker = new RegExp(
            this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.end)
        );
    }
};
oop.inherits(FoldMode, BaseFoldMode);

(function() {
    
    this.foldingStartMarker = /(\{|\[)[^\}\]]*$|^\s*(\/\*)/;
    this.foldingStopMarker = /^[^\[\{]*(\}|\])|^[\s\*]*(\*\/)/;
    this.singleLineBlockCommentRe= /^\s*(\/\*).*\*\/\s*$/;
    this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/;
    this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/;
    this._getFoldWidgetBase = this.getFoldWidget;
    this.getFoldWidget = function(session, foldStyle, row) {
        var line = session.getLine(row);
    
        if (this.singleLineBlockCommentRe.test(line)) {
            if (!this.startRegionRe.test(line) && !this.tripleStarBlockCommentRe.test(line))
                return "";
        }
    
        var fw = this._getFoldWidgetBase(session, foldStyle, row);
    
        if (!fw && this.startRegionRe.test(line))
            return "start"; // lineCommentRegionStart
    
        return fw;
    };

    this.getFoldWidgetRange = function(session, foldStyle, row, forceMultiline) {
        var line = session.getLine(row);
        
        if (this.startRegionRe.test(line))
            return this.getCommentRegionBlock(session, line, row);
        
        var match = line.match(this.foldingStartMarker);
        if (match) {
            var i = match.index;

            if (match[1])
                return this.openingBracketBlock(session, match[1], row, i);
                
            var range = session.getCommentFoldRange(row, i + match[0].length, 1);
            
            if (range && !range.isMultiLine()) {
                if (forceMultiline) {
                    range = this.getSectionRange(session, row);
                } else if (foldStyle != "all")
                    range = null;
            }
            
            return range;
        }

        if (foldStyle === "markbegin")
            return;

        var match = line.match(this.foldingStopMarker);
        if (match) {
            var i = match.index + match[0].length;

            if (match[1])
                return this.closingBracketBlock(session, match[1], row, i);

            return session.getCommentFoldRange(row, i, -1);
        }
    };
    
    this.getSectionRange = function(session, row) {
        var line = session.getLine(row);
        var startIndent = line.search(/\S/);
        var startRow = row;
        var startColumn = line.length;
        row = row + 1;
        var endRow = row;
        var maxRow = session.getLength();
        while (++row < maxRow) {
            line = session.getLine(row);
            var indent = line.search(/\S/);
            if (indent === -1)
                continue;
            if  (startIndent > indent)
                break;
            var subRange = this.getFoldWidgetRange(session, "all", row);
            
            if (subRange) {
                if (subRange.start.row <= startRow) {
                    break;
                } else if (subRange.isMultiLine()) {
                    row = subRange.end.row;
                } else if (startIndent == indent) {
                    break;
                }
            }
            endRow = row;
        }
        
        return new Range(startRow, startColumn, endRow, session.getLine(endRow).length);
    };
    this.getCommentRegionBlock = function(session, line, row) {
        var startColumn = line.search(/\s*$/);
        var maxRow = session.getLength();
        var startRow = row;
        
        var re = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/;
        var depth = 1;
        while (++row < maxRow) {
            line = session.getLine(row);
            var m = re.exec(line);
            if (!m) continue;
            if (m[1]) depth--;
            else depth++;

            if (!depth) break;
        }

        var endRow = row;
        if (endRow > startRow) {
            return new Range(startRow, startColumn, endRow, line.length);
        }
    };

}).call(FoldMode.prototype);

});

ace.define("ace/mode/lsl",["require","exports","module","ace/mode/lsl_highlight_rules","ace/mode/matching_brace_outdent","ace/range","ace/mode/text","ace/mode/behaviour/cstyle","ace/mode/folding/cstyle","ace/lib/oop"], function(require, exports, module) {
"use strict";

var Rules = require("./lsl_highlight_rules").LSLHighlightRules;
var Outdent = require("./matching_brace_outdent").MatchingBraceOutdent;
var Range = require("../range").Range;
var TextMode = require("./text").Mode;
var CstyleBehaviour = require("./behaviour/cstyle").CstyleBehaviour;
var CStyleFoldMode = require("./folding/cstyle").FoldMode;
var oop = require("../lib/oop");

var Mode = function() {
    this.HighlightRules = Rules;
    this.$outdent = new Outdent();
    this.$behaviour = new CstyleBehaviour();
    this.foldingRules = new CStyleFoldMode();
};
oop.inherits(Mode, TextMode);

(function() {

    this.lineCommentStart = ["//"];

    this.blockComment = {
        start: "/*",
        end: "*/"
    };

    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);

        var tokenizedLine = this.getTokenizer().getLineTokens(line, state);
        var tokens = tokenizedLine.tokens;
        var endState = tokenizedLine.state;

        if (tokens.length && tokens[tokens.length-1].type === "comment.block.lsl") {
            return indent;
        }

        if (state === "start") {
            var match = line.match(/^.*[\{\(\[]\s*$/);
            if (match) {
                indent += tab;
            }
        }

        return indent;
    };

    this.checkOutdent = function(state, line, input) {
        return this.$outdent.checkOutdent(line, input);
    };

    this.autoOutdent = function(state, doc, row) {
        this.$outdent.autoOutdent(doc, row);
    };

    this.$id = "ace/mode/lsl";
}).call(Mode.prototype);

exports.Mode = Mode;
});
