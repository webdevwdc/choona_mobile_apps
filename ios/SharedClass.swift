//
//  SharedClass.swift
//  MusicApp
//
//  Created by Agnisikha Guria on 15/09/20.
//  Copyright © 2020 wts. All rights reserved.
//

import UIKit

class SharedClass: NSObject {
    private override init() { }
       static let shared = SharedClass()
    var developerToken : String?
}
