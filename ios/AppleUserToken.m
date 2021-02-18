//
//  AppleUserToken.m
//  Choona
//
//  Created by webskitters on 02/09/20.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(Print, NSObject)

RCT_EXTERN_METHOD(
                  printValue: (NSString *)developerToken
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )
@end
